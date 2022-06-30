import React from 'react';
import { useData } from 'rvpress';

import NavBarTitle from './NavBarTitle';
import NavLinks from './NavLinks';
import NoopComponent from './NoopComponent';
import Suspense from './Suspense';
import ToggleSideBarButton from './ToggleSideBarButton';
import cls from './NavBar.module.scss';
import { wrapCls } from '../utils';

const AlgoliaSearchBox = __ALGOLIA__ ? React.lazy(() => import('./AlgoliaSearchBox')) : NoopComponent;

export default ({ toggle }: { toggle?: () => void }) => {
    const { theme } = useData();
    return (
        <header className={wrapCls(cls, 'nav-bar')}>
            <ToggleSideBarButton toggle={toggle} />
            <NavBarTitle />
            <div className="flex-grow" />
            <div className="nav">
                <NavLinks />
            </div>
            {theme.algolia && (
                <Suspense>
                    <AlgoliaSearchBox options={theme.algolia} />
                </Suspense>
            )}
        </header>
    );
};
