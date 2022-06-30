# API 指南

## 帮助函数

下面的方法可以从 `rvpress` 中进行全局 import，一般用于自定义主题。

以 `use*` 开头的方法为 React Hook。

### `useData`

返回当前页面相关的数据，接口数据结构如下：（T 用来定义主题相关接口配置）

```ts
interface RVPressData<T = any> {
    site: SiteData;
    page: PageData;
    theme: T;
    frontmatter: PageData['frontmatter'];
    title: string;
    description: string;
    lang: string;
    localePath: string;
}
```

**Example:**

```tsx
import { useData } from 'rvpress';

export default () => {
    const { theme } = useData();
    return <div>{theme.title}</div>;
};
```

### `useRoute`

返回当前 route，数据结构如下:

::: danger
还在变动中，暂勿使用
:::

```ts
interface Route {
    path: string;
    data: PageData;
    component: Component | null;
}
```

### `useRouter`

返回当前 router 对象，数据结构如下:

::: danger
还在变动中，暂勿使用
:::

```ts
interface Router {
    route: Route;
    go: (href?: string) => Promise<void>;
}
```

### `withBase`

-   **Type**: `(path: string) => string`

    将 [`base`](/config/basics.html#base) 拼接到对应的 `url` 前. 参考 [Base URL](/guide/assets.html#base-url).

## 全局 Components

RVPress 提供了一些全局的组件，可在自定义主题中使用。

### `<Content/>`

`<Content/>` 用于展示当前 `markdown` 内容. 当需要 [自定义主题](/guide/theming.html) 时可使用.

```tsx
import { Content } from 'rvpress';

export default () => (
    <>
        <h1>Custom Layout!</h1>
        <Content />
    </>
);
```

### `<ClientOnly/>`

`<ClientOnly/>` 用于渲染只在客户端展示的内容。

由于 RVPress 程序会启用 SSR 来生成静态资源，所以如果部分内容只需要在客户端展示(或依赖客户端环境)，可以使用 `<ClientOnly/>` 来渲染。

用法如下:

```tsx
<ClientOnly>
    <NonSSRFriendlyComponent />
</ClientOnly>
```
