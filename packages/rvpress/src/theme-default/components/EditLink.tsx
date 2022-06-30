import React from 'react';

import { useEditLink } from '../hooks/editLink';
import OutboundLink from './icons/OutboundLink';
import cls from './EditLink.module.scss';
import { wrapCls } from '../utils';

const EditLink = () => {
    const { url, text } = useEditLink();
    return (
        <div className={wrapCls(cls, 'edit-link')}>
            {url && (
                <a className="link" href={url} target="_blank" rel="noopener noreferrer">
                    {text} <OutboundLink className="icon" />
                </a>
            )}
        </div>
    );
};

export default EditLink;
