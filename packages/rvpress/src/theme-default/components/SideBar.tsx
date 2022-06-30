import React from 'react';

import NavLinks from './NavLinks';
import SideBarLinks from './SideBarLinks';
import cls from './SideBar.module.scss';

export default ({ open }: { open: boolean }) => {
    return (
        <aside className={'sidebar ' + cls['sidebar'] + (open ? ' open' : '')}>
            <NavLinks />
            <SideBarLinks />
        </aside>
    );
};
