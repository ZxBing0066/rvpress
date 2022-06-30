import { useData, useRoute } from 'rvpress';
import type { DefaultTheme } from '../config';

export function useLanguageLinks() {
    const { site, localePath, theme } = useData();

    return (() => {
        const langs = site.langs;
        const localePaths = Object.keys(langs);

        // one language
        if (localePaths.length < 2) {
            return null;
        }

        const route = useRoute();

        // intentionally remove the leading slash because each locale has one
        const currentPath = route.path.replace(localePath, '');

        const candidates = localePaths.map(localePath => ({
            text: langs[localePath].label,
            link: `${localePath}${currentPath}`
        }));

        const selectText = theme.selectText || 'Languages';

        return {
            text: selectText,
            items: candidates
        } as DefaultTheme.NavItemWithChildren;
    })();
}
