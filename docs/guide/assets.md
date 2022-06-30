# 静态资源处理

所有的 Markdown 文件都会使用 [Vite](https://github.com/vitejs/vite) 编译为 React 组件，你需要将所有的静态资源引用为相对路径：

```md
![An image](./image.png)
```

你可以在 `markdown` 中引用静态资源，在样式中引用静态资源。

常见的图片、媒体和字体文件类型会自动被检测并作为静态资源使用。

生产环境所有被引用的静态资源都会被拷贝到 `dist` 目录下，并且会使用哈希命名。没被引用的静态资源不会被拷贝。小于 4kb 的图片会作为 base64 嵌入。

## Public 文件夹

有时候你可能需要提供一些不在 Markdown 或主题组件中被引用的静态资源（例如，favicon 和 PWA icon）。在项目根目录下的 `public` 目录可以用作脱离源码引用的资源。引用时文件名必须保持不变。

在 `public` 目录下的资源将被拷贝到 dist 目录下。

注意，你应该在 `public` 目录下引用的文件使用根绝对路径 - 例如，`public/icon.png` 在源码中应该使用 `/icon.png` 来引用。

## Base URL

如果你的网站被部署到非根 URL 下，你需要在 `.rvpress/config.js` 中设置 `base` 选项。例如，如果你计划将你的网站部署到 `https://foo.github.io/bar/`，那 `base` 应该被设置为 `'/bar/'`（它应该始终以斜杠开头和结尾）。

所有的静态资源路径都会被自动处理，以适应不同的 `base` 配置值。例如，如果你在 Markdown 中使用绝对路径引用了 `public` 目录下的资源：

```md
![An image](/image-inside-public.png)
```

如果你更改了 `base` 配置，你不需要在 Markdown 中更新它，因为它已经被自动处理。

然而，如果你在自定义主题组件引用静态资源，例如，其中一个图片的 `src` 基于主题配置值：

```jsx
<img src={theme.logoPath} />
```

这种情况下，建议使用 [`withBase`](/guide/api.html#withbase) 来包装路径：

```jsx
import { withBase, useData } from 'rvpress';

export default () => {
    const { theme } = useData();
    return <img src={withBase(theme.logoPath)} />;
};
```
