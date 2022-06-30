// Customized pre-fetch for page chunks based on
// https://github.com/GoogleChromeLabs/quicklink

import { useEffect } from 'react';
import { useRoute } from './router';
import { inBrowser, pathToFile } from './utils';

const hasFetched = new Set<string>();
const createLink = () => document.createElement('link');

const viaDOM = (url: string) => {
    const link = createLink();
    link.rel = `prefetch`;
    link.href = url;
    document.head.appendChild(link);
};

const viaXHR = (url: string) => {
    const req = new XMLHttpRequest();
    req.open('GET', url, (req.withCredentials = true));
    req.send();
};

let link;
const doFetch: (url: string) => void =
    inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports('prefetch')
        ? viaDOM
        : viaXHR;

export function usePrefetch() {
    if (!inBrowser) {
        return;
    }

    if (!window.IntersectionObserver) {
        return;
    }

    let conn;
    if ((conn = (navigator as any).connection) && (conn.saveData || /2g/.test(conn.effectiveType))) {
        // Don't prefetch if using 2G or if Save-Data is enabled.
        return;
    }

    const rIC = (window as any).requestIdleCallback || setTimeout;
    let observer: IntersectionObserver | null = null;

    const observeLinks = () => {
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const link = entry.target as HTMLAnchorElement;
                    observer?.unobserve(link);
                    const { pathname } = link;
                    if (!hasFetched.has(pathname)) {
                        hasFetched.add(pathname);
                        const pageChunkPath = pathToFile(pathname);
                        doFetch(pageChunkPath);
                    }
                }
            });
        });

        rIC(() => {
            document.querySelectorAll('#app a').forEach(link => {
                const { target, hostname, pathname } = link as HTMLAnchorElement;
                const extMatch = pathname.match(/\.\w+$/);
                if (extMatch && extMatch[0] !== '.html') {
                    return;
                }

                if (
                    // only prefetch same tab navigation, since a new tab will load
                    // the lean js chunk instead.
                    target !== `_blank` &&
                    // only prefetch inbound links
                    hostname === location.hostname
                ) {
                    if (pathname !== location.pathname) {
                        observer?.observe(link);
                    } else {
                        // No need to prefetch chunk for the current page, but also mark
                        // it as already fetched. This is because the initial page uses its
                        // lean chunk, and if we don't mark it, navigation to another page
                        // with a link back to the first page will fetch its full chunk
                        // which isn't needed.
                        hasFetched.add(pathname);
                    }
                }
            });
        });
    };

    const route = useRoute();
    useEffect(() => {
        observeLinks();
        return () => {
            observer && observer.disconnect();
        };
    }, [route.path]);
}
