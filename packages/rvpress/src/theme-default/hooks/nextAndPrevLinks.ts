import { useData } from 'rvpress';
import { isArray, ensureStartingSlash, removeExtension } from '../utils';
import { getSideBarConfig, getFlatSideBarLinks } from '../support/sideBar';

export function useNextAndPrevLinks() {
    const { page, theme } = useData();

    const path = (() => {
        return removeExtension(ensureStartingSlash(page.relativePath));
    })();

    const candidates = (() => {
        const config = getSideBarConfig(theme.sidebar, path);

        return isArray(config) ? getFlatSideBarLinks(config) : [];
    })();

    const index = (() => {
        return candidates.findIndex(item => {
            return item.link === path;
        });
    })();

    const next = (() => {
        if (theme.nextLinks !== false && index > -1 && index < candidates.length - 1) {
            return candidates[index + 1];
        }
    })();

    const prev = (() => {
        if (theme.prevLinks !== false && index > 0) {
            return candidates[index - 1];
        }
    })();

    const hasLinks = (() => !!next || !!prev)();

    return {
        next,
        prev,
        hasLinks
    };
}
