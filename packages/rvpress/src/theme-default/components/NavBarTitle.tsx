import React from 'react';
import { withBase, useData } from 'rvpress';

import { wrapCls } from '../utils';
import cls from './NavBarTitle.module.scss';

export default () => {
    const { site, theme, localePath } = useData();
    return (
        <a className={wrapCls(cls, 'nav-bar-title')} href={localePath} aria-label="`${site.title}, back to home`">
            {theme.logo && <img className="logo" src={withBase(theme.logo)} alt="Logo" />}
            {site.title}
        </a>
    );
};
