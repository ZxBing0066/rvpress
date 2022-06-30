import React, { useEffect, useRef } from 'react';
import { useData, useRoute, useRouter } from 'rvpress';
import '@docsearch/css';
import docsearch from '@docsearch/js';
import type { DocSearchHit } from '@docsearch/react/dist/esm/types/DocSearchHit';

import type { DefaultTheme } from '../config';
import './AlgoliaSearchBox.scss';

function isSpecialClick(event: MouseEvent) {
    return event.button === 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
}

function getRelativePath(absoluteUrl: string) {
    const { pathname, hash } = new URL(absoluteUrl);

    return pathname + hash;
}

export default (props: { options: DefaultTheme.AlgoliaSearchOptions; multilang?: boolean }) => {
    const route = useRoute();
    const router = useRouter();

    function initialize(userOptions: any) {
        docsearch(
            Object.assign({}, userOptions, {
                container: '#docsearch',

                searchParameters: Object.assign({}, userOptions.searchParameters, {
                    // pass a custom lang facetFilter to allow multiple language search
                    // https://github.com/algolia/docsearch-configs/pull/3942
                    facetFilters
                }),

                navigator: {
                    navigate: ({ itemUrl }: { itemUrl: string }) => {
                        const { pathname: hitPathname } = new URL(window.location.origin + itemUrl);

                        // Router doesn't handle same-page navigation so we use the native
                        // browser location API for anchor navigation
                        if (route.path === hitPathname) {
                            window.location.assign(window.location.origin + itemUrl);
                        } else {
                            router.go(itemUrl);
                        }
                    }
                },

                transformItems: (items: DocSearchHit[]) => {
                    return items.map(item => {
                        return Object.assign({}, item, {
                            url: getRelativePath(item.url)
                        });
                    });
                },

                hitComponent: ({ hit, children }: { hit: DocSearchHit; children: any }) => {
                    const relativeHit = hit.url.startsWith('http') ? getRelativePath(hit.url as string) : hit.url;

                    return {
                        type: 'a',
                        ref: undefined,
                        constructor: undefined,
                        key: undefined,
                        props: {
                            href: hit.url,
                            onClick: (event: MouseEvent) => {
                                if (isSpecialClick(event)) {
                                    return;
                                }

                                // we rely on the native link scrolling when user is already on
                                // the right anchor because Router doesn't support duplicated
                                // history entries
                                if (route.path === relativeHit) {
                                    return;
                                }

                                // if the hits goes to another page, we prevent the native link
                                // behavior to leverage the Router loading feature
                                if (route.path !== relativeHit) {
                                    event.preventDefault();
                                }

                                router.go(relativeHit);
                            },
                            children
                        },
                        __v: null
                    };
                }
            })
        );
    }

    useEffect(() => {
        // update(props.options);
    }, [props.options]);

    useEffect(() => {
        initialize(props.options);
    }, []);

    const { lang } = useData();

    // if the user has multiple locales, the search results should be filtered
    // based on the language
    const facetFilters: string[] = props.multilang ? ['lang:' + lang] : [];

    if (props.options.searchParameters?.facetFilters) {
        facetFilters.push(...props.options.searchParameters.facetFilters);
    }
    const langRef = useRef(lang);
    useEffect(() => {
        const oldLang = langRef.current;
        const index = facetFilters.findIndex(filter => filter === 'lang:' + oldLang);
        if (index > -1) {
            facetFilters.splice(index, 1, 'lang:' + lang);
        }
        langRef.current = lang;
    }, [lang]);

    return <div className="algolia-search-box" id="docsearch" />;
};
