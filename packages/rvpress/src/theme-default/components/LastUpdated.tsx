import React from 'react';
import { useData } from 'rvpress';

import { wrapCls } from '../utils';
import cls from './LastUpdated.module.scss';

export default () => {
    const { theme, page } = useData();

    const hasLastUpdated = (() => {
        const lu = theme.lastUpdated;
        return lu !== undefined && lu !== false;
    })();

    const prefix = (() => {
        const p = theme.lastUpdated;
        return p === true ? 'Last Updated' : p;
    })();

    // locale string might be different based on end user
    // and will lead to potential hydration mismatch if calculated at build time
    const datetime = new Date(page.lastUpdated).toLocaleString('en-US');
    return hasLastUpdated ? (
        <p className={wrapCls(cls, 'last-updated')}>
            <span className="prefix">{prefix}:</span>
            <span className="datetime">{datetime}</span>
        </p>
    ) : null;
};
