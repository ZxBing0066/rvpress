import { UserConfig, DefaultTheme } from 'rvpress';

const config: UserConfig<DefaultTheme.Config> = {
    lang: 'zh-CN',
    title: 'RVPress',
    description: 'React & Vite powered static site generator.',

    head: [
        [
            'link',
            {
                rel: 'icon',
                type: 'image/svg+xml',
                href: '/favicon.svg'
            }
        ]
    ],

    themeConfig: {
        repo: 'ZxBing0066/rvpress',
        docsDir: 'docs',
        docsBranch: 'main',
        editLinks: true,
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',

        nav: [
            { text: 'Guide', link: '/', activeMatch: '^/$|^/guide/' },
            {
                text: 'Config Reference',
                link: '/config/basics',
                activeMatch: '^/config/'
            }
        ],

        sidebar: {
            '/guide/': getGuideSidebar(),
            '/config/': getConfigSidebar(),
            '/': getGuideSidebar()
        }
    }
};

export default config;

function getGuideSidebar() {
    return [
        {
            text: 'Introduction',
            children: [
                { text: 'What is RVPress?', link: '/' },
                { text: 'Getting Started', link: '/guide/getting-started' },
                { text: 'Configuration', link: '/guide/configuration' },
                { text: 'Asset Handling', link: '/guide/assets' },
                { text: 'Markdown Extensions', link: '/guide/markdown' },
                { text: 'Using Vue in Markdown', link: '/guide/using-vue' },
                { text: 'Deploying', link: '/guide/deploy' }
            ]
        },
        {
            text: 'Advanced',
            children: [
                { text: 'Frontmatter', link: '/guide/frontmatter' },
                { text: 'Theming', link: '/guide/theming' },
                { text: 'API Reference', link: '/guide/api' }
            ]
        }
    ];
}

function getConfigSidebar() {
    return [
        {
            text: 'App Config',
            children: [{ text: 'Basics', link: '/config/basics' }]
        },
        {
            text: 'Theme Config',
            children: [
                { text: 'Homepage', link: '/config/homepage' },
                { text: 'Algolia Search', link: '/config/algolia-search' },
                { text: 'Carbon Ads', link: '/config/carbon-ads' }
            ]
        }
    ];
}
