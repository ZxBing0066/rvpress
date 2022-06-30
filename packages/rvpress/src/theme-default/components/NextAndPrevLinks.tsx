import React from 'react';
import { withBase } from 'rvpress';

import { wrapCls } from '../utils';
import { useNextAndPrevLinks } from '../hooks/nextAndPrevLinks';
import ArrowLeft from './icons/ArrowLeft';
import ArrowRight from './icons/ArrowRight';
import cls from './NextAndPrevLinks.module.scss';

const NextAndPrevLinks = () => {
    const { hasLinks, prev, next } = useNextAndPrevLinks();
    return hasLinks ? (
        <div className={wrapCls(cls, 'next-and-prev-link')}>
            <div className="container">
                <div className="prev">
                    {prev && (
                        <a className="link" href={withBase(prev.link)}>
                            <ArrowLeft className="icon icon-prev" />
                            <span className="text">{prev.text}</span>
                        </a>
                    )}
                </div>
                <div className="next">
                    {next && (
                        <a className="link" href={withBase(next.link)}>
                            <span className="text">{next.text}</span>
                            <ArrowRight className="icon icon-next" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};

export default NextAndPrevLinks;
