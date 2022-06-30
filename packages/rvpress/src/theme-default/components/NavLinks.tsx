import React from 'react';
import { useData } from 'rvpress';

import { useLanguageLinks } from '../hooks/nav';
import { useRepo } from '../hooks/repo';
import NavLink from './NavLink';
import NavDropdownLink from './NavDropdownLink';
import cls from './NavLinks.module.scss';

export default () => {
    const { theme } = useData();
    const localeLinks = useLanguageLinks();
    const repo = useRepo();
    const show = theme.nav || repo || localeLinks;

    return show ? (
        <nav className={'nav-links ' + cls['nav-links']}>
            {theme.nav &&
                theme.nav.map((item: any) => {
                    return (
                        <div key={item.text} className="item">
                            {item.items ? <NavDropdownLink item={item} /> : <NavLink item={item} />}
                        </div>
                    );
                })}
            {localeLinks && (
                <div className="item">
                    <NavDropdownLink item={localeLinks} />
                </div>
            )}
            {repo && (
                <div className="item">
                    <NavLink item={repo} />
                </div>
            )}
        </nav>
    ) : null;
};
