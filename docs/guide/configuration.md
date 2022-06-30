# 配置

## 概览

如果没有任何配置，页面会很简单，而用户将无法导航到其他页面。要自定义您的站点，请首先在您的文档目录中创建一个 `.rvpress` 目录。这里将存放所有 rvpress 相关文件。您的项目结构可能像这样：

```bash
.
├─ docs
│  ├─ .rvpress
│  │  └─ config.js
│  └─ index.md
└─ package.json
```

配置文件为 `.rvpress/config.js`，该文件应该导出一个 JavaScript 对象:

```js
module.exports = {
    title: 'Hello RVPress',
    description: 'Just playing around.'
};
```

全部配置参考 [配置指南](/config/basics).

## 配置提示

rvpress 支持 ts 的类型提示，可以在您的 IDE 中借助 jsdoc 来使用它们：

```js
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
    // ...
};

export default config;
```

另外，您也可以使用 `defineConfig` 帮助函数，这样可以不需要 jsdoc 注释，也能提供提示:

```js
import { defineConfig } from 'rvpress';

export default defineConfig({
    // ...
});
```

RVPress 同样支持 ts 的配置文件。您可以使用 `.rvpress/config.ts` 文件，并使用 `defineConfig` 帮助函数。

## Typed Theme Config

By default, `defineConfig` helper leverages the theme config type from default theme:

```ts
import { defineConfig } from 'vitepress';

export default defineConfig({
    themeConfig: {
        // Type is `DefaultTheme.Config`
    }
});
```

If you use a custom theme and want type checks for the theme config, you'll need to use `defineConfigWithTheme` instead, and pass the config type for your custom theme via a generic argument:

```ts
import { defineConfigWithTheme } from 'vitepress';
import { ThemeConfig } from 'your-theme';

export default defineConfigWithTheme<ThemeConfig>({
    themeConfig: {
        // Type is `ThemeConfig`
    }
});
```
