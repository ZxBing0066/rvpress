import React from 'react';

import { wrapCls } from '../utils';
import EditLink from './EditLink';
import LastUpdated from './LastUpdated';
import cls from './PageFooter.module.scss';

const PageFooter = () => {
    return (
        <footer className={wrapCls(cls, 'page-footer')}>
            <div className="edit">
                <EditLink />
            </div>
            <div className="updated">
                <LastUpdated />
            </div>
        </footer>
    );
};

export default PageFooter;
