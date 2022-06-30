import React from 'react';

import type { DefaultTheme } from '../config';
import { useNavLink } from '../hooks/navLink';
import OutboundLink from './icons/OutboundLink';

const styles = `
.item {
  display: block;
  padding: 0 1.5rem 0 2.5rem;
  line-height: 32px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--c-text);
  white-space: nowrap;
}

@media (min-width: 720px) {
  .item {
    padding: 0 24px 0 12px;
    line-height: 32px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--c-text);
    white-space: nowrap;
  }

  .item.active .arrow {
    opacity: 1;
  }
}

.item:hover,
.item.active {
  text-decoration: none;
  color: var(--c-brand);
}

.item.external:hover {
  border-bottom-color: transparent;
  color: var(--c-text);
}

@media (min-width: 720px) {
  .arrow {
    display: inline-block;
    margin-right: 8px;
    border-top: 6px solid #ccc;
    border-right: 4px solid transparent;
    border-bottom: 0;
    border-left: 4px solid transparent;
    vertical-align: middle;
    opacity: 0;
    transform: translateY(-2px) rotate(-90deg);
  }
}
`;

export default ({ item }: { item: DefaultTheme.NavItemWithLink }) => {
    const {
        props: { className, ...linkProps },
        isExternal
    } = useNavLink(item);
    return (
        <>
            <style>{styles}</style>
            <div className="nav-dropdown-link-item">
                <a className={'item' + (className ? ' ' + className : '')} {...linkProps}>
                    <span className="arrow" />
                    <span className="text">{item.text}</span>
                    <span className="icon">{isExternal && <OutboundLink />}</span>
                </a>
            </div>
        </>
    );
};
