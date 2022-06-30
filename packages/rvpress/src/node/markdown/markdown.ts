import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import attrs from 'markdown-it-attrs';
import emoji from 'markdown-it-emoji';
import toc from 'markdown-it-table-of-contents';

import { Header } from '../shared';
import { highlight } from './plugins/highlight';
import { slugify } from './plugins/slugify';
import { highlightLinePlugin } from './plugins/highlightLines';
import { lineNumberPlugin } from './plugins/lineNumbers';
import { componentPlugin } from './plugins/component';
import { containerPlugin } from './plugins/containers';
import { snippetPlugin } from './plugins/snippet';
import { preWrapperPlugin } from './plugins/preWrapper';
import { linkPlugin } from './plugins/link';
import { headingPlugin } from './plugins/headings';

import { parseHeader } from '../utils/parseHeader';

export interface MarkdownOptions extends MarkdownIt.Options {
    lineNumbers?: boolean;
    config?: (md: MarkdownIt) => void;
    anchor?: {
        permalink?: anchor.AnchorOptions['permalink'];
    };
    attrs?: {
        leftDelimiter?: string;
        rightDelimiter?: string;
        allowedAttributes?: string[];
    };
    // https://github.com/Oktavilla/markdown-it-table-of-contents
    toc?: any;
    externalLinks?: Record<string, string>;
}

export interface MarkdownParsedData {
    links?: string[];
    headers?: Header[];
}

export interface MarkdownRenderer extends MarkdownIt {
    __path: string;
    __relativePath: string;
    __data: MarkdownParsedData;
}

export type { Header };

export const createMarkdownRenderer = (srcDir: string, options: MarkdownOptions = {}): MarkdownRenderer => {
    const md = MarkdownIt({
        html: true,
        linkify: true,
        highlight,
        ...options
    }) as MarkdownRenderer;

    // custom plugins
    // remove hoistPlugin for the difference between vue & react
    md.use(componentPlugin)
        .use(highlightLinePlugin)
        .use(preWrapperPlugin)
        .use(snippetPlugin, srcDir)
        .use(containerPlugin)
        .use(headingPlugin)
        .use(linkPlugin, {
            target: '_blank',
            rel: 'noopener noreferrer',
            ...options.externalLinks
        })
        // 3rd party plugins
        .use(attrs, options.attrs)
        .use(anchor, {
            slugify,
            permalink: anchor.permalink.ariaHidden({}),
            ...options.anchor
        })
        .use(toc, {
            slugify,
            includeLevel: [2, 3],
            format: parseHeader,
            ...options.toc
        })
        .use(emoji);

    // apply user config
    if (options.config) {
        options.config(md);
    }

    if (options.lineNumbers) {
        md.use(lineNumberPlugin);
    }

    const originalRender = md.render;
    md.render = (...args) => {
        md.__data = {};
        return originalRender.call(md, ...args);
    };

    return md;
};
