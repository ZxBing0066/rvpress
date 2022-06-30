import React from 'react';
import { useRoute, useData } from 'rvpress';

import { Header } from '../../client/shared';
import { DefaultTheme } from '../config';
import { joinUrl, isActive } from '../utils';

interface HeaderWithChildren extends Header {
    children?: Header[];
}

export const SideBarLink = (props: { depth?: number; item: DefaultTheme.SideBarItem }) => {
    const route = useRoute();
    const { site, frontmatter } = useData();
    const depth = props.depth || 1;
    const maxDepth = frontmatter.sidebarDepth || Infinity;

    const headers = route.data.headers;
    const text = props.item.text;
    const link = resolveLink(site.base, props.item.link);
    const children = (props.item as DefaultTheme.SideBarGroup).children;
    const active = isActive(route, props.item.link);
    const childItems = depth < maxDepth ? createChildren(active, children, headers, depth + 1) : null;

    return (
        <li className="sidebar-link">
            {link ? (
                <a className="sidebar-link-item" href={link}>
                    {text}
                </a>
            ) : (
                <p className="sidebar-link-item">{text}</p>
            )}
            {childItems}
        </li>
    );
};

function resolveLink(base: string, path?: string): string | undefined {
    if (path === undefined) {
        return path;
    }

    // keep relative hash to the same page
    if (path.startsWith('#')) {
        return path;
    }

    return joinUrl(base, path);
}

function createChildren(
    active: boolean,
    children?: DefaultTheme.SideBarItem[],
    headers?: Header[],
    depth = 1
): JSX.Element | null {
    if (children && children.length > 0) {
        return (
            <ul className="sidebar-links">
                {children.map((c, i) => {
                    return <SideBarLink key={i} item={c as any} depth={depth} />;
                })}
            </ul>
        );
    }

    return active && headers ? createChildren(false, resolveHeaders(headers), undefined, depth) : null;
}

function resolveHeaders(headers: Header[]): DefaultTheme.SideBarItem[] {
    return mapHeaders(groupHeaders(headers));
}

function groupHeaders(headers: Header[]): HeaderWithChildren[] {
    headers = headers.map(h => Object.assign({}, h));
    let lastH2: HeaderWithChildren;
    headers.forEach(h => {
        if (h.level === 2) {
            lastH2 = h;
        } else if (lastH2) {
            (lastH2.children || (lastH2.children = [])).push(h);
        }
    });
    return headers.filter(h => h.level === 2);
}

function mapHeaders(headers: HeaderWithChildren[]): DefaultTheme.SideBarItem[] {
    return headers.map(header => ({
        text: header.title,
        link: `#${header.slug}`,
        children: header.children ? mapHeaders(header.children) : undefined
    }));
}
