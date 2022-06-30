import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import Theme from '@theme';

import { inBrowser, pathToFile } from './utils';
import { Router, createRouter, Route, useRoute } from './router';
import { useData } from './data';
import Context from './Context';
import { usePrefetch } from './preFetch';
import { useUpdateHead } from './head';

const NotFound = Theme.NotFound || (() => <>404 Not Found</>);

function newRouter(): Router {
    let isInitialPageLoad = inBrowser;
    let initialPath: string;

    return createRouter(path => {
        let pageFilePath = pathToFile(path);

        if (isInitialPageLoad) {
            initialPath = pageFilePath;
        }

        // use lean build if this is the initial page load or navigating back
        // to the initial loaded path (the static vnodes already adopted the
        // static content on that load so no need to re-fetch the page)
        if (isInitialPageLoad || initialPath === pageFilePath) {
            pageFilePath = pageFilePath.replace(/\.js$/, '.lean.js');
        }

        // in browser: native dynamic import
        if (inBrowser) {
            isInitialPageLoad = false;

            return import(/*@vite-ignore*/ pageFilePath);
        }

        // SSR: sync require
        // @ts-ignore
        return require(pageFilePath);
    }, <NotFound />);
}

const RVPress = () => {
    const { site } = useData();
    useEffect(() => {
        document.documentElement.lang = site.lang;
    }, [site]);

    if (import.meta.env.PROD) {
        // in prod mode, enable intersectionObserver based pre-fetch
        usePrefetch();
    }

    const route = useRoute();
    const data = useData();
    useUpdateHead(route, data.site);

    return <Theme.Layout />;
};

const RVPressApp = ({ router }: { router: Router }) => {
    const [route, setRoute] = useState(router.route);

    const handleRouteChange = (route: Route) => {
        setRoute({ ...route });
    };

    useEffect(() => {
        router.on(handleRouteChange);
        handleHMR(router, handleRouteChange);
        return () => {
            router.off();
        };
    }, []);

    return (
        <React.StrictMode>
            <Context.Provider value={{ router, route }}>
                <RVPress />
            </Context.Provider>
        </React.StrictMode>
    );
};

function handleHMR(router: Router, handleRouteChange: (route: Route) => void): void {
    // update route.data on HMR updates of active page
    if (import.meta.hot) {
        // hot reload pageData
        import.meta.hot?.on('rvpress:pageData', payload => {
            if (shouldHotReload(payload)) {
                router.route.data = payload.pageData;
                handleRouteChange(router.route);
            }
        });
    }
}

function shouldHotReload(payload: any): boolean {
    const payloadPath = payload.path.replace(/(\bindex)?\.md$/, '');
    const locationPath = location.pathname.replace(/(\bindex)?\.html$/, '');

    return payloadPath === locationPath;
}

export function createApp() {
    const router = newRouter();

    return { app: <RVPressApp router={router} />, router };
}

if (inBrowser) {
    // wait until page component is fetched before mounting
    const { app, router } = createApp();
    router.go().then(() => {
        ReactDOM.render(app, document.querySelector('#app'));
    });
}
