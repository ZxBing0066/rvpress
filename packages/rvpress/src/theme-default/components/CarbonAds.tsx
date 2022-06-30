import React, { useEffect, useRef } from 'react';

export default ({ code, placement }: { code: string; placement: string }) => {
    const elRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const s = document.createElement('script');
        s.id = '_carbonads_js';
        s.src = `//cdn.carbonads.com/carbon.js?serve=${code}&placement=${placement}`;
        elRef.current?.appendChild(s);
    }, []);

    return <div className="carbon-ads" ref={elRef} />;
};
