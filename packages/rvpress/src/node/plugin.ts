import path from 'path';
import { OutputAsset, OutputChunk } from 'rollup';
import { defineConfig, mergeConfig, Plugin, ResolvedConfig } from 'vite';
import fs from 'fs';

import { SiteConfig, resolveSiteData } from './config';
import { createMarkdownToReactRenderFn } from './markdownToReact';
import { DIST_CLIENT_PATH, APP_PATH, SITE_DATA_REQUEST_PATH, SITE_PAGE_LIST_REQUEST_PATH } from './alias';
import { slash } from './utils/slash';
import { staticDataPlugin } from './staticDataPlugin';
import { URL } from 'url';

const hashRE = /\.(\w+)\.js$/;
const staticInjectMarkerRE = /\b(const _hoisted_\d+ = \/\*(?:#|@)__PURE__\*\/\s*createStaticVNode)\("(.*)", (\d+)\)/g;
const staticStripRE = /['"`]__RVP_STATIC_START__[^]*?__RVP_STATIC_END__['"`]/g;
const staticRestoreRE = /__RVP_STATIC_(START|END)__/g;

const isPageChunk = (chunk: OutputAsset | OutputChunk): chunk is OutputChunk & { facadeModuleId: string } =>
    !!(chunk.type === 'chunk' && chunk.isEntry && chunk.facadeModuleId && chunk.facadeModuleId.endsWith('.md'));

export function createRVPressPlugin(
    root: string,
    siteConfig: SiteConfig,
    ssr = false,
    pageToHashMap?: Record<string, string>,
    clientJSMap?: Record<string, string>
) {
    const {
        srcDir,
        configPath,
        alias,
        markdown,
        site,
        react: userReactPluginOptions,
        vite: userViteConfig,
        pages
    } = siteConfig;

    let markdownToReact: ReturnType<typeof createMarkdownToReactRenderFn>;

    const reactPlugin = require('@vitejs/plugin-react')({
        include: [/\.jsx$/, /\.tsx$/, /\.md$/],
        jsxRuntime: 'classic',
        ...userReactPluginOptions
    });

    let siteData = site;
    let hasDeadLinks = false;
    let config: ResolvedConfig;

    const getPageList = async () => {
        const list = [];
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const currentFile = path.join(srcDir, page);
            const { pageData: currentPageData } = await markdownToReact(
                fs.readFileSync(currentFile, 'utf-8'),
                currentFile,
                config.publicDir
            );
            list.push(currentPageData);
        }
        return list;
    };

    const RVPressPlugin: Plugin = {
        name: 'rvpress',

        configResolved(resolvedConfig) {
            config = resolvedConfig;
            markdownToReact = createMarkdownToReactRenderFn(
                srcDir,
                markdown,
                pages,
                config.define,
                config.command === 'build'
            );
        },

        config() {
            const baseConfig = defineConfig({
                resolve: {
                    alias
                },
                define: {
                    __CARBON__: !!site.themeConfig.carbonAds?.carbon,
                    __BSA__: !!site.themeConfig.carbonAds?.custom,
                    __ALGOLIA__: !!site.themeConfig.algolia
                },
                optimizeDeps: {
                    include: ['react', 'react-dom'],
                    exclude: ['@docsearch/js']
                },
                server: {
                    fs: {
                        allow: [DIST_CLIENT_PATH, srcDir, process.cwd()]
                    }
                }
            });
            return userViteConfig ? mergeConfig(userViteConfig, baseConfig) : baseConfig;
        },

        resolveId(id) {
            if (id === SITE_DATA_REQUEST_PATH) return SITE_DATA_REQUEST_PATH;
            if (id === SITE_PAGE_LIST_REQUEST_PATH) return SITE_PAGE_LIST_REQUEST_PATH;
        },

        async load(id) {
            // resolve site data require
            if (id === SITE_DATA_REQUEST_PATH) {
                let data = siteData;
                // head info is not needed by the client in production build
                if (config.command === 'build') {
                    data = { ...siteData, head: [] };
                }
                return `export default ${JSON.stringify(JSON.stringify(data))}`;
            }
            if (id === SITE_PAGE_LIST_REQUEST_PATH) {
                const pageList = await getPageList();
                return `export default ${JSON.stringify(JSON.stringify(pageList))}`;
            }
        },

        async transform(code, id) {
            if (id.endsWith('.md')) {
                const { reactSrc, deadLinks, includes } = await markdownToReact(code, id, config.publicDir);
                if (deadLinks.length) {
                    hasDeadLinks = true;
                }
                if (includes.length) {
                    includes.forEach(i => {
                        this.addWatchFile(i);
                    });
                }
                return reactSrc;
            }
        },

        renderStart() {
            if (hasDeadLinks) {
                throw new Error(`One or more pages contain dead links.`);
            }
        },

        configureServer(server) {
            if (configPath) {
                server.watcher.add(configPath);
            }

            // serve our index.html after vite history fallback
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    const url = new URL(req.url!, `http://${req.headers.host}`);
                    if (url.pathname?.endsWith('.html')) {
                        res.statusCode = 200;
                        res.end(
                            await server.transformIndexHtml(
                                req.url!,
                                `
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="description" content="">
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/@fs/${APP_PATH}/index.js"></script>
    </body>
</html>`
                            )
                        );
                        return;
                    }
                    next();
                });
            };
        },

        renderChunk(code, chunk) {
            if (!ssr && isPageChunk(chunk as OutputChunk)) {
                code = code.replace(staticInjectMarkerRE, '$1("__RVP_STATIC_START__$2__RVP_STATIC_END__", $3)');
                return code;
            }
            return null;
        },

        generateBundle(_options, bundle) {
            if (ssr) {
                // ssr build:
                // delete all asset chunks
                for (const name in bundle) {
                    if (bundle[name].type === 'asset') {
                        delete bundle[name];
                    }
                }
            } else {
                // client build:
                // for each .md entry chunk, adjust its name to its correct path.
                for (const name in bundle) {
                    const chunk = bundle[name];
                    if (isPageChunk(chunk)) {
                        // record page -> hash relations
                        const hash = chunk.fileName.match(hashRE)![1];
                        pageToHashMap![chunk.name.toLowerCase()] = hash;

                        // inject another chunk with the content stripped
                        bundle[name + '-lean'] = {
                            ...chunk,
                            fileName: chunk.fileName.replace(/\.js$/, '.lean.js'),
                            code: chunk.code.replace(staticStripRE, `""`)
                        };

                        // remove static markers from original code
                        chunk.code = chunk.code.replace(staticRestoreRE, '');
                    }
                }
            }
        },

        async handleHotUpdate(ctx) {
            // handle config hmr
            const { file, read, server } = ctx;
            if (file === configPath) {
                const newData = await resolveSiteData(root);
                if (newData.base !== siteData.base) {
                    console.warn(`[rvpress]: config.base has changed. Please restart the dev server.`);
                }
                siteData = newData;
                return [server.moduleGraph.getModuleById(SITE_DATA_REQUEST_PATH)!];
            }

            // hot reload .md files as react files
            if (file.endsWith('.md')) {
                const content = await read();
                const { pageData, reactSrc } = await markdownToReact(content, file, config.publicDir);

                // notify the client to update page data
                server.ws.send({
                    type: 'custom',
                    event: 'rvpress:pageData',
                    data: {
                        path: `/${slash(path.relative(srcDir, file))}`,
                        pageData
                    }
                });

                // overwrite src so react plugin can handle the HMR
                ctx.read = () => reactSrc;
                const fileModules = server.moduleGraph.getModulesByFile(file);
                const pageListModule = server.moduleGraph.getModuleById(SITE_PAGE_LIST_REQUEST_PATH)!;
                return fileModules ? [...fileModules, pageListModule] : [pageListModule];
            }
        }
    };

    return [reactPlugin, RVPressPlugin, ...(userViteConfig?.plugins || []), staticDataPlugin];
}
