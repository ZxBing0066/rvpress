import React from 'react';

import type { DefaultTheme } from '../config';
import { useNavLink } from '../hooks/navLink';
import OutboundLink from './icons/OutboundLink';
import cls from './NavLink.module.scss';

export default ({ item, className }: { item: DefaultTheme.NavItemWithLink; className?: string }) => {
    const {
        isExternal,
        props: { className: _className, ...linkProps }
    } = useNavLink(item);
    return (
        <div
            className={
                'nav-link ' +
                cls['nav-link'] +
                (className ? ' ' + className : '') +
                (_className ? ' ' + _className : '')
            }
        >
            <a className="item" {...linkProps}>
                {item.text} {isExternal && <OutboundLink />}
            </a>
        </div>
    );
};
