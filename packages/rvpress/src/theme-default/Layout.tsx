import React, { useCallback, useState } from 'react';
import { useData, Content, Debug } from 'rvpress';

// import { isSideBarEmpty, getSideBarConfig } from './support/sideBar';
// components
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Page from './components/Page';
const Home = React.lazy(() => import('./components/Home'));

const HomeView = () => {
    return (
        <slot name="home">
            {/* TODO: home hero, feature, etc */}
            <Home />
        </slot>
    );
};

const MainContent = () => {
    const { frontmatter } = useData();
    if (frontmatter.customLayout) {
        return <Content />;
    }
    if (frontmatter.enableHome) {
        return <HomeView />;
    }
    return <Page />;
};

const Layout = () => {
    const [openSidebar, setOpenSidebar] = useState(false);
    const { frontmatter, site, theme } = useData();
    const toggleSidebar = useCallback(() => {
        setOpenSidebar(open => !open);
    }, []);

    const showNavbar = (() => {
        const themeConfig = theme;
        if (frontmatter.navbar === false || themeConfig.navbar === false) {
            return false;
        }
        return site.title || themeConfig.logo || themeConfig.repo || themeConfig.nav;
    })();
    return (
        <div className="theme">
            {showNavbar && <NavBar toggle={toggleSidebar} />}
            <SideBar open={openSidebar}></SideBar>
            <MainContent />
            <Debug />
        </div>
    );
};

export default Layout;
