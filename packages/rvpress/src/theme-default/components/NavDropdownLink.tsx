import React, { useEffect, useState } from 'react';
import { useRoute } from 'rvpress';

import type { DefaultTheme } from '../config';
import NavDropdownLinkItem from './NavDropdownLinkItem';
import cls from './NavDropdownLink.module.scss';
import { wrapCls } from '../utils';

export default ({ item }: { item: DefaultTheme.NavItemWithChildren }) => {
    const route = useRoute();

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [route.path]);

    function toggle() {
        setOpen(open => !open);
    }

    return (
        <div className={wrapCls(cls, 'nav-dropdown-link', open ? ' open' : '')}>
            <button className="button" aria-label={item.ariaLabel} onClick={toggle}>
                <span className="button-text">{item.text}</span>
                <span className={'button-arrow ' + (open ? 'down' : 'right')} />
            </button>

            <ul className="dialog">
                {item.items.map(item => (
                    <li key={item.text} className="dialog-item">
                        <NavDropdownLinkItem item={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
