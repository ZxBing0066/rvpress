import React from 'react';
import { Content } from 'rvpress/dist/client';

const Header = () => {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Logo</h1>
            <ul>
                <li>
                    <a href="/">首页</a>
                </li>
            </ul>
        </header>
    );
};

const Layout = () => {
    return (
        <div>
            <Header />
            <Content />
        </div>
    );
};

const theme = {
    Layout,
    NotFound: Layout
};

export default theme;
