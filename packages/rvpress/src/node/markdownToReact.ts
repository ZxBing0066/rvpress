import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import LRUCache from 'lru-cache';
import chalk from 'chalk';
import _debug from 'debug';

import { PageData, HeadConfig, EXTERNAL_URL_RE } from './shared';
import { createMarkdownRenderer, MarkdownOptions } from './markdown/markdown';
import { deeplyParseHeader } from './utils/parseHeader';
import { slash } from './utils/slash';
import getGitTimestamp from './utils/gitTimestamp';

const debug = _debug('rvpress:md');
const cache = new LRUCache<string, MarkdownCompileResult>({ max: 1024 });
const includesRE = /<!--\s*@include:\s*(.*?)\s*-->/g;

export interface MarkdownCompileResult {
    reactSrc: string;
    pageData: PageData;
    deadLinks: string[];
    includes: string[];
}

export function createMarkdownToReactRenderFn(
    srcDir: string,
    options: MarkdownOptions = {},
    pages: string[],
    userDefines: Record<string, any> | undefined,
    isBuild = false
) {
    const md = createMarkdownRenderer(srcDir, options);
    pages = pages.map(p => slash(p.replace(/\.md$/, '')));

    const userDefineRegex = userDefines
        ? new RegExp(
              `\\b(${Object.keys(userDefines)
                  .map(key => key.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'))
                  .join('|')})`,
              'g'
          )
        : null;

    return async (src: string, file: string, publicDir: string): Promise<MarkdownCompileResult> => {
        const relativePath = slash(path.relative(srcDir, file));
        const dir = path.dirname(file);

        const cached = cache.get(src);
        if (cached) {
            debug(`[cache hit] ${relativePath}`);
            return cached;
        }

        const start = Date.now();

        // resolve includes
        const includes: string[] = [];
        src = src.replace(includesRE, (_, m1) => {
            const includePath = path.join(dir, m1);
            const content = fs.readFileSync(includePath, 'utf-8');
            includes.push(slash(includePath));
            return content;
        });

        const { content, data: frontmatter } = matter(src);

        // reset state before render
        md.__path = file;
        md.__relativePath = relativePath;

        let html = md.render(content);
        const data = md.__data;

        if (isBuild) {
            // avoid env variables being replaced by vite
            html = html.replace(/\bimport\.meta/g, 'import.<wbr/>meta').replace(/\bprocess\.env/g, 'process.<wbr/>env');

            // also avoid replacing vite user defines
            if (userDefineRegex) {
                html = html.replace(userDefineRegex, _ => `${_[0]}<wbr/>${_.slice(1)}`);
            }
        }

        // validate data.links
        const deadLinks: string[] = [];
        const recordDeadLink = (url: string) => {
            console.warn(chalk.yellow(`\n(!) Found dead link ${chalk.cyan(url)} in file ${chalk.white.dim(file)}`));
            deadLinks.push(url);
        };

        if (data.links) {
            const dir = path.dirname(file);
            for (let url of data.links) {
                if (url.replace(EXTERNAL_URL_RE, '').startsWith('//localhost:')) {
                    recordDeadLink(url);
                    continue;
                }

                url = url.replace(/[?#].*$/, '').replace(/\.(html|md)$/, '');
                if (url.endsWith('/')) url += `index`;
                const resolved = decodeURIComponent(
                    slash(url.startsWith('/') ? url.slice(1) : path.relative(srcDir, path.resolve(dir, url)))
                );
                if (!pages.includes(resolved) && !fs.existsSync(path.resolve(dir, publicDir, `${resolved}.html`))) {
                    recordDeadLink(url);
                }
            }
        }

        const [createTime, lastUpdated] = await getGitTimestamp(file);
        const pageData: PageData = {
            title: inferTitle(frontmatter, content),
            description: inferDescription(frontmatter),
            frontmatter,
            headers: data.headers || [],
            relativePath,
            createTime,
            lastUpdated
        };

        // TODO inject global config components for support
        const reactSrc =
            // inject react
            `import React from 'react';\n` +
            // inject pageData
            `export const __pageData = ${JSON.stringify(JSON.stringify(pageData))}\n` +
            // inject page content
            // TODO call html to react here
            `export default () => (${JSON.stringify(html)})`;

        debug(`[render] ${file} in ${Date.now() - start}ms.`);

        const result = {
            reactSrc,
            pageData,
            deadLinks,
            includes
        };
        cache.set(src, result);
        return result;
    };
}

const inferTitle = (frontmatter: any, content: string) => {
    if (frontmatter.home) {
        return 'Home';
    }
    if (frontmatter.title) {
        return deeplyParseHeader(frontmatter.title);
    }
    const match = content.match(/^\s*#+\s+(.*)/m);
    if (match) {
        return deeplyParseHeader(match[1].trim());
    }
    return '';
};

const inferDescription = (frontmatter: Record<string, any>) => {
    const { description, head } = frontmatter;

    if (description !== undefined) {
        return description;
    }

    return (head && getHeadMetaContent(head, 'description')) || '';
};

const getHeadMetaContent = (head: HeadConfig[], name: string): string | undefined => {
    if (!head || !head.length) {
        return undefined;
    }

    const meta = head.find(([tag, attrs = {}]) => {
        return tag === 'meta' && attrs.name === name && attrs.content;
    });

    return meta && meta[1].content;
};
