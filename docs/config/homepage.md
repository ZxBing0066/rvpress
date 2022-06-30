# 首页

RVPress 提供了一个首页布局。如果要使用它，在你的根目录下的 `index.md` 文件中指定 `home: true` 并在其 [YAML 前缀](/guide/frontmatter) 中添加其他元数据。以下为一个示例：

```yaml
---
home: true
heroImage: /logo.png
heroAlt: Logo image
heroText: Hero Title
tagline: Hero subtitle
actionText: Get Started
actionLink: /guide/
features:
    - title: Simplicity First
      details: Minimal setup with markdown-centered project structure helps you focus on writing.
    - title: Vue-Powered
      details: Enjoy the dev experience of Vue + webpack, use Vue components in markdown, and develop custom themes with Vue.
    - title: Performant
      details: RVPress generates pre-rendered static HTML for each page, and runs as an SPA once a page is loaded.
footer: MIT Licensed | Copyright © 2019-present ZxBing0066
---
```
