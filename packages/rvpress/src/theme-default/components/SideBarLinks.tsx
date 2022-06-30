import React from 'react';

import { useSideBar } from '../hooks/sideBar';
import { SideBarLink } from './SideBarLink';

export default () => {
    const items = useSideBar();
    return items.length ? (
        <ul className="sidebar-links">
            {items.map((item, i) => (
                <SideBarLink item={item} key={i} />
            ))}
        </ul>
    ) : null;
};
