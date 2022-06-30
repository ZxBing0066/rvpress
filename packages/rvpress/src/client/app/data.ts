import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import serializedSiteData from '@siteData';
import serializedPageList from '@pageList';

import { resolveSiteDataByRoute, PageData, SiteData } from '../shared';
import { Route, useRoute } from './router';
import { withBase } from './utils';

export interface RVPressData<T = any> {
    site: SiteData<T>;
    page: PageData;
    pageList: PageData[];
    theme: T;
    frontmatter: PageData['frontmatter'];
    title: string;
    description: string;
    lang: string;
    localePath: string;
}

function parse(data: string): SiteData {
    return JSON.parse(data) as SiteData;
}

function parsePageList(data: string): PageData[] {
    return JSON.parse(data) as PageData[];
}

export let siteData: SiteData = parse(serializedSiteData);
let pageList: PageData[] = parsePageList(serializedPageList);

// hmr
if (import.meta.hot) {
    import.meta.hot.accept('/@siteData', m => {
        siteData = parse(m.default);
        dispatchSiteDataChange();
    });

    import.meta.hot.accept('/@pageList', m => {
        pageList = parsePageList(m.default);
        dispatchPageListChange();
    });
}

type Listener = (siteData: SiteData) => void;

const listeners: Listener[] = [];

export const onSiteDataChange = (listener: Listener) => {
    listeners.push(listener);
    return () => {
        listeners.filter(_listener => listener !== _listener);
    };
};

const dispatchSiteDataChange = () => {
    listeners.forEach(listener => listener?.(siteData));
};

type PageListListener = (pageList: PageData[]) => void;

const pageListListeners: PageListListener[] = [];

export const onPageListChange = (listener: PageListListener) => {
    pageListListeners.push(listener);
    return () => {
        pageListListeners.filter(_listener => listener !== _listener);
    };
};

const dispatchPageListChange = () => {
    pageListListeners.forEach(listener => listener?.(pageList));
};

// per-app data
export function initData(route: Route): RVPressData {
    const site = (() => resolveSiteDataByRoute(siteData, route.path))();

    return {
        site,
        pageList,
        theme: (() => site.themeConfig)(),
        page: (() => route.data)(),
        frontmatter: (() => route.data.frontmatter)(),
        lang: (() => site.lang)(),
        localePath: (() => {
            const { langs, lang } = site;
            const path = Object.keys(langs).find(langPath => langs[langPath].lang === lang);
            return withBase(path || '/');
        })(),
        title: route.data.title ? route.data.title + ' | ' + site.title : site.title,
        description: route.data.description || site.description
    };
}

const getDataByRoute = (route: Route): RVPressData => {
    const site = (() => resolveSiteDataByRoute(siteData, route.path))();

    return {
        site,
        pageList,
        theme: site.themeConfig,
        page: route.data,
        frontmatter: route.data.frontmatter || {},
        lang: site.lang,
        title: route.data.title ? route.data.title + ' | ' + site.title : site.title,
        description: route.data.description || site.description,
        localePath: (() => {
            const { langs, lang } = site;
            const path = Object.keys(langs).find(langPath => langs[langPath].lang === lang);
            return withBase(path || '/');
        })()
    };
};

export function useData<T = any>(): RVPressData<T> {
    const route = useRoute();
    const [data, setData] = useState(() => getDataByRoute(route));
    // use Ref for reduce handleChange reproduce
    const routeRef = useRef(route);

    const handleChange = useCallback(() => {
        setData(getDataByRoute(routeRef.current));
    }, []);

    const destroy = useMemo(() => {
        const destroySiteDataListen = onSiteDataChange(handleChange);
        const destroyPageListListen = onPageListChange(handleChange);
        return () => {
            destroySiteDataListen();
            destroyPageListListen();
        };
    }, []);

    useEffect(() => {
        return destroy;
    }, []);

    useEffect(() => {
        routeRef.current = route;
        handleChange();
    }, [route]);

    return data;
}
