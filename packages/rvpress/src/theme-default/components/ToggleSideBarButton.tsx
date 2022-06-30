import React from 'react';

import { wrapCls } from '../utils';
import cls from './ToggleSideBarButton.module.scss';

export default ({ toggle }: { toggle?: () => void }) => {
    return (
        <div className={wrapCls(cls, 'sidebar-button')} onClick={toggle}>
            <svg
                className="icon"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                viewBox="0 0 448 512"
            >
                <path
                    fill="currentColor"
                    d="M436 124H12c-6.627 0-12-5.373-12-12V80c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12zm0 160H12c-6.627 0-12-5.373-12-12v-32c0-6.627 5.373-12 12-12h424c6.627 0 12 5.373 12 12v32c0 6.627-5.373 12-12 12z"
                />
            </svg>
        </div>
    );
};
