import { UserConfig } from 'rvpress/dist/node';
// import { ThemeConfig } from '@rvpress/theme-blog/';

type ThemeConfig = any;

const config: UserConfig<ThemeConfig> = {
    lang: 'en-US',
    title: 'RVPress',
    description: 'React & Vite powered static site generator.',
    theme: '@rvpress/theme-blog',
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
        logo: 'RVPress Blog',
        lastUpdated: 'Last Updated',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Blog', link: '/blog/' },
            {
                text: 'Tags',
                link: '/tags/',
                items: [
                    {
                        text: 'Demo',
                        link: '/blog/?tag=demo'
                    },
                    {
                        text: 'Post',
                        link: '/blog/?tag=post'
                    }
                ]
            },
            { text: 'About', link: '/about/' },
            { text: 'Github', link: 'https://github.com/ZxBing0066/rvpress', target: '_blank' }
        ]
    }
};

export default config;
