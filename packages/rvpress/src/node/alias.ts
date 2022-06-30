import path from 'path';
import { Alias, AliasOptions } from 'vite';

const PKG_ROOT = path.join(__dirname, '../../');
const PACKAGE_ROOT = path.join(__dirname, '..');

export const DIST_CLIENT_PATH = path.join(PACKAGE_ROOT, 'client');
export const APP_PATH = path.join(DIST_CLIENT_PATH, 'app');
export const SHARED_PATH = path.join(PACKAGE_ROOT, 'shared/shared');
export const DEFAULT_THEME_PATH = path.join(PACKAGE_ROOT, 'theme-default');

// special virtual file
// we can't directly import '/@siteData' because
// - it's not an actual file so we can't use tsconfig paths to redirect it
// - TS doesn't allow shimming a module that starts with '/'
export const SITE_DATA_ID = '@siteData';
export const SITE_DATA_REQUEST_PATH = '/' + SITE_DATA_ID;

export const SITE_PAGE_LIST_ID = '@pageList';
export const SITE_PAGE_LIST_REQUEST_PATH = '/' + SITE_PAGE_LIST_ID;

// resolve all builtin aliases
export function resolveAliases(root: string, themeDir: string): AliasOptions {
    const paths: Record<string, string> = {
        '@theme': themeDir,
        shared: SHARED_PATH,
        [SITE_DATA_ID]: SITE_DATA_REQUEST_PATH,
        [SITE_PAGE_LIST_ID]: SITE_PAGE_LIST_REQUEST_PATH
    };

    const reactPath = require.resolve('react');
    const reactDOMPath = require.resolve('react-dom');
    const jsxDevRuntimePath = require.resolve('react/jsx-dev-runtime');

    const aliases: Alias[] = [
        ...Object.keys(paths).map(p => ({
            find: p,
            replacement: paths[p]
        })),
        {
            find: /^rvpress$/,
            replacement: path.join(DIST_CLIENT_PATH, 'index')
        },
        // alias for local linked development
        { find: /^rvpress\//, replacement: PKG_ROOT + '/' },
        {
            find: /^react$/,
            replacement: reactPath
        },
        {
            find: /^react-dom$/,
            replacement: reactDOMPath
        },
        {
            find: /^react\/jsx-dev-runtime$/,
            replacement: jsxDevRuntimePath
        }
    ];

    return aliases;
}
