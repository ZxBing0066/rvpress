import React, { useEffect } from 'react';

import './BuySellAds.scss';

// global _bsa
const ID = 'bsa-cpc-script';

declare global {
    const _bsa: BSA | undefined;

    interface BSA {
        init(
            name: string,
            code: string,
            placement: string,
            options: {
                target: string;
                align: string;
                disable_css?: 'true' | 'false';
            }
        ): void;
    }
}

export default ({ code, placement }: { code: string; placement: string }) => {
    function load() {
        if (typeof _bsa !== 'undefined' && _bsa) {
            const parent = document.querySelector('.bsa-cpc')!;
            // cleanup any existing ad to avoid them stacking
            parent.innerHTML = '';

            _bsa.init('default', code, `placement:${placement}`, {
                target: '.bsa-cpc',
                align: 'horizontal',
                disable_css: 'true'
            });
        }
    }

    useEffect(() => {
        if (!document.getElementById(ID)) {
            const s = document.createElement('script');

            s.id = ID;
            s.src = '//m.servedby-buysellads.com/monetization.js';

            document.head.appendChild(s);

            s.onload = () => {
                load();
            };
        } else {
            load();
        }
    }, []);

    return (
        <div className="buy-sell-ads">
            <div className="bsa-cpc" />
        </div>
    );
};
