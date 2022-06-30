// resolve config
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import globby from 'globby';
import _debug from 'debug';
import {
    normalizePath,
    AliasOptions,
    UserConfig as ViteConfig,
    mergeConfig as mergeViteConfig,
    loadConfigFromFile
} from 'vite';
import { Options as ReactPluginOptions } from '@vitejs/plugin-react';

import { SiteData, HeadConfig, LocaleConfig, createLangDictionary } from './shared';
import { resolveAliases, DEFAULT_THEME_PATH } from './alias';
import { MarkdownOptions } from './markdown/markdown';

const debug = _debug('rvpress:config');

export type { MarkdownOptions };

export interface UserConfig<ThemeConfig = any> {
    extends?: RawConfigExports<ThemeConfig>;
    lang?: string;
    base?: string;
    title?: string;
    description?: string;
    head?: HeadConfig[];
    theme?: string;
    themeConfig?: ThemeConfig;
    locales?: Record<string, LocaleConfig>;
    markdown?: MarkdownOptions;
    /**
     * Options to pass on to `@vitejs/plugin-react`
     */
    react?: ReactPluginOptions;
    /**
     * Vite config
     */
    vite?: ViteConfig;

    srcDir?: string;
    srcExclude?: string[];
    outDir?: string;
    shouldPreload?: (link: string, page: string) => boolean;

    /**
     * Enable MPA / zero-JS mode
     * @experimental
     */
    mpa?: boolean;
}

export type RawConfigExports<ThemeConfig = any> =
    | UserConfig<ThemeConfig>
    | Promise<UserConfig<ThemeConfig>>
    | (() => UserConfig<ThemeConfig> | Promise<UserConfig<ThemeConfig>>);

export interface SiteConfig<ThemeConfig = any>
    extends Pick<UserConfig, 'markdown' | 'react' | 'vite' | 'shouldPreload' | 'mpa'> {
    root: string;
    srcDir: string;
    site: SiteData<ThemeConfig>;
    configPath: string | undefined;
    themeDir: string;
    outDir: string;
    tempDir: string;
    alias: AliasOptions;
    pages: string[];
}

const resolve = (root: string, file: string) => normalizePath(path.resolve(root, `.rvpress`, file));

/**
 * Type config helper
 */
export function defineConfig<T>(config: UserConfig<T>) {
    return config;
}

/**
 * Type config helper for custom theme config
 */
export function defineConfigWithTheme<ThemeConfig>(config: UserConfig<ThemeConfig>) {
    return config;
}

export async function resolveConfig(
    root: string = process.cwd(),
    command: 'serve' | 'build' = 'serve',
    mode = 'development'
): Promise<SiteConfig> {
    const [userConfig, configPath] = await resolveUserConfig(root, command, mode);
    const site = await resolveSiteData(root, userConfig);
    const srcDir = path.resolve(root, userConfig.srcDir || '.');
    const outDir = userConfig.outDir ? path.resolve(root, userConfig.outDir) : resolve(root, 'dist');

    // resolve theme path
    const userThemeDir = resolve(root, 'theme');
    const themeDir = await (async () => {
        if (await fs.pathExists(userThemeDir)) return userThemeDir;
        if (userConfig.theme) {
            try {
                return require.resolve(userConfig.theme);
            } catch (error) {
                if (await fs.pathExists(path.resolve(__dirname, '..', userConfig.theme))) {
                    return path.resolve(__dirname, '..', userConfig.theme);
                } else {
                    debug(`Theme directory does not existed. ${chalk.yellow(userConfig.theme)}`);
                }
            }
        }
        return DEFAULT_THEME_PATH;
    })();
    if (themeDir !== DEFAULT_THEME_PATH) debug(`Use theme from ${chalk.yellow(themeDir)}`);

    // Important: globby/fast-glob doesn't guarantee order of the returned files.
    // We must sort the pages so the input list to rollup is stable across
    // builds - otherwise different input order could result in different exports
    // order in shared chunks which in turns invalidates the hash of every chunk!
    // JavaScript built-in sort() is mandated to be stable as of ES2019 and
    // supported in Node 12+, which is required by Vite.
    const pages = (
        await globby(['**.md'], {
            cwd: srcDir,
            ignore: ['**/node_modules', ...(userConfig.srcExclude || [])]
        })
    ).sort();

    const config: SiteConfig = {
        root,
        srcDir,
        site,
        themeDir,
        pages,
        configPath,
        outDir,
        tempDir: resolve(root, '.temp'),
        markdown: userConfig.markdown,
        alias: resolveAliases(root, themeDir),
        react: userConfig.react,
        vite: userConfig.vite,
        shouldPreload: userConfig.shouldPreload,
        mpa: !!userConfig.mpa
    };

    return config;
}

const supportedConfigExtensions = ['js', 'ts', 'mjs', 'mts'];

async function resolveUserConfig(
    root: string,
    command: 'serve' | 'build',
    mode: string
): Promise<[UserConfig, string | undefined]> {
    // load user config
    let configPath;
    for (const ext of supportedConfigExtensions) {
        const p = resolve(root, `config.${ext}`);
        if (await fs.pathExists(p)) {
            configPath = p;
            break;
        }
    }

    const userConfig: RawConfigExports = configPath
        ? ((
              await loadConfigFromFile(
                  {
                      command,
                      mode
                  },
                  configPath,
                  root
              )
          )?.config as any)
        : {};

    if (configPath) {
        debug(`loaded config at ${chalk.yellow(configPath)}`);
    } else {
        debug(`no config file found.`);
    }

    return [await resolveConfigExtends(userConfig), configPath];
}

async function resolveConfigExtends(config: RawConfigExports): Promise<UserConfig> {
    const resolved = await (typeof config === 'function' ? config() : config);
    if (resolved.extends) {
        const base = await resolveConfigExtends(resolved.extends);
        return mergeConfig(base, resolved);
    }
    return resolved;
}

function mergeConfig(a: UserConfig, b: UserConfig, isRoot = true) {
    const merged: Record<string, any> = { ...a };
    for (const key in b) {
        const value = b[key as keyof UserConfig];
        if (value == null) {
            continue;
        }
        const existing = merged[key];
        if (Array.isArray(existing) && Array.isArray(value)) {
            merged[key] = [...existing, ...value];
            continue;
        }
        if (isObject(existing) && isObject(value)) {
            if (isRoot && key === 'vite') {
                merged[key] = mergeViteConfig(existing, value);
            } else {
                merged[key] = mergeConfig(existing, value, false);
            }
            continue;
        }
        merged[key] = value;
    }
    return merged;
}

function isObject(value: unknown): value is Record<string, any> {
    return Object.prototype.toString.call(value) === '[object Object]';
}

export async function resolveSiteData(
    root: string,
    userConfig?: UserConfig,
    command: 'serve' | 'build' = 'serve',
    mode = 'development'
): Promise<SiteData> {
    userConfig = userConfig || (await resolveUserConfig(root, command, mode))[0];
    return {
        lang: userConfig.lang || 'en-US',
        title: userConfig.title || 'RVPress',
        description: userConfig.description || 'A RVPress site',
        base: userConfig.base ? userConfig.base.replace(/([^/])$/, '$1/') : '/',
        head: userConfig.head || [],
        themeConfig: userConfig.themeConfig || {},
        locales: userConfig.locales || {},
        langs: createLangDictionary(userConfig)
    };
}
