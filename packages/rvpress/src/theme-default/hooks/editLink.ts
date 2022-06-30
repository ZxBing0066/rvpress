import { useMemo } from 'react';
import { useData } from 'rvpress';

import { endingSlashRE, isExternal } from '../utils';

const bitbucketRE = /bitbucket.org/;

export function useEditLink() {
    const { page, theme, frontmatter } = useData();

    const url = useMemo(() => {
        const { repo, docsDir = '', docsBranch = 'master', docsRepo = repo, editLinks } = theme;

        const showEditLink = frontmatter.editLink != null ? frontmatter.editLink : editLinks;
        const { relativePath } = page;

        if (!showEditLink || !relativePath || !repo) {
            return null;
        }

        return createUrl(repo, docsRepo, docsDir, docsBranch, relativePath);
    }, [theme, page, frontmatter]);

    const text = useMemo(() => {
        return theme.editLinkText || 'Edit this page';
    }, [theme]);

    return {
        url,
        text
    };
}

function createUrl(repo: string, docsRepo: string, docsDir: string, docsBranch: string, path: string): string {
    return bitbucketRE.test(repo)
        ? createBitbucketUrl(repo, docsRepo, docsDir, docsBranch, path)
        : createGitHubUrl(repo, docsRepo, docsDir, docsBranch, path);
}

function createGitHubUrl(repo: string, docsRepo: string, docsDir: string, docsBranch: string, path: string): string {
    const base = isExternal(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`;

    return (
        base.replace(endingSlashRE, '') +
        `/edit` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path
    );
}

function createBitbucketUrl(repo: string, docsRepo: string, docsDir: string, docsBranch: string, path: string): string {
    const base = isExternal(docsRepo) ? docsRepo : repo;

    return (
        base.replace(endingSlashRE, '') +
        `/src` +
        `/${docsBranch}/` +
        (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '') +
        path +
        `?mode=edit&spa=0&at=${docsBranch}&fileviewer=file-view-default`
    );
}
