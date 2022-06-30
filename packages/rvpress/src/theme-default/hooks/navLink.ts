import { useRoute, withBase } from 'rvpress';
import { isExternal as isExternalCheck } from '../utils';
import type { DefaultTheme } from '../config';

export function useNavLink(item: DefaultTheme.NavItemWithLink) {
    const route = useRoute();

    const isExternal = isExternalCheck(item.link);

    const props = (() => {
        const routePath = normalizePath(`/${route.data.relativePath}`);

        let active = false;
        if (item.activeMatch) {
            active = new RegExp(item.activeMatch).test(routePath);
        } else {
            const itemPath = normalizePath(item.link);
            active = itemPath === '/' ? itemPath === routePath : routePath.startsWith(itemPath);
        }

        return {
            className: (active ? 'active' : '') + (isExternal ? ' is-external' : ''),
            href: isExternal ? item.link : withBase(item.link),
            target: item.target || (isExternal ? `_blank` : undefined),
            rel: item.rel || (isExternal ? `noopener noreferrer` : undefined),
            'aria-label': item.ariaLabel
        };
    })();

    return {
        props,
        isExternal
    };
}

function normalizePath(path: string): string {
    return path
        .replace(/#.*$/, '')
        .replace(/\?.*$/, '')
        .replace(/\.(html|md)$/, '')
        .replace(/\/index$/, '/');
}
