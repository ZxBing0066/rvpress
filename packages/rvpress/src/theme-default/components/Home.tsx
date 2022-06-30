import React from 'react';
import { Content } from 'rvpress';

import HomeHero from './HomeHero';
import HomeFeatures from './HomeFeatures';
import HomeFooter from './HomeFooter';
import cls from './Home.module.scss';
import { wrapCls } from '../utils';

const Home = () => {
    return (
        <main className={wrapCls(cls, 'home')} aria-labelledby="main-title">
            <HomeHero />
            <slot name="hero" />
            <HomeFeatures />
            <div className="home-content">
                <Content />
            </div>
            <slot name="features" />
            <HomeFooter />
            <slot name="footer" />
        </main>
    );
};

export default Home;
