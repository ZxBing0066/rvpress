import React from 'react';
import { Content, useData } from 'rvpress';

import PageFooter from './PageFooter';
import NextAndPrevLinks from './NextAndPrevLinks';
import NoopComponent from './NoopComponent';
import Suspense from './Suspense';
import cls from './Page.module.scss';
import { wrapCls } from '../utils';

const CarbonAds = __CARBON__ ? React.lazy(() => import('./CarbonAds')) : NoopComponent;
const BuySellAds = __BSA__ ? React.lazy(() => import('./BuySellAds')) : NoopComponent;

const Page = () => {
    const { page, theme } = useData();
    return (
        <main className={wrapCls(cls, 'page')}>
            <div className="page-container">
                {theme.carbonAds && theme.carbonAds.carbon && (
                    <div id="ads-container">
                        <Suspense>
                            <CarbonAds
                                key={'carbon' + page.relativePath}
                                code={theme.carbonAds.carbo}
                                placement={theme.carbonAds.placement}
                            />
                        </Suspense>
                    </div>
                )}

                <Content className="content" />
                <PageFooter />
                <NextAndPrevLinks />

                {theme.carbonAds && theme.carbonAds.custom && (
                    <Suspense>
                        <BuySellAds
                            key={'custom' + page.relativePath}
                            code={theme.carbonAds.custom}
                            placement={theme.carbonAds.placement}
                        />
                    </Suspense>
                )}
            </div>
        </main>
    );
};

export default Page;
