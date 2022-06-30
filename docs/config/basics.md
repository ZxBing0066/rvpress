# App Config: Basics

::: tip
The config reference is incomplete since the config format may still receive further changes. For a complete reference of the current available options, refer to [config.ts](https://github.com/ZxBing0066/rvpress/blob/master/src/node/config.ts#L24).
:::

## base

-   Type: `string`
-   Default: `/`

The base URL the site will be deployed at. You will need to set this if you plan to deploy your site under a sub path, for example, GitHub pages. If you plan to deploy your site to `https://foo.github.io/bar/`, then you should set base to `'/bar/'`. It should always start and end with a slash.

The `base` is automatically prepended to all the URLs that start with `/` in other options, so you only need to specify it once.

```js
module.exports = {
    base: '/base/'
};
```

## lang

-   Type: `string`
-   Default: `en-US`

The `lang` attribute for the site. This will render as a `<html lang="en-US">` tag in the page HTML.

```js
module.exports = {
    lang: 'en-US'
};
```

## title

-   Type: `string`
-   Default: `RVPress`

Title for the site. This will be the suffix for all page titles, and displayed in the navbar.

```js
module.exports = {
    title: 'RVPress'
};
```

## description

-   Type: `string`
-   Default: `A RVPress site`

Description for the site. This will render as a `<meta>` tag in the page HTML.

```js
module.exports = {
    description: 'A RVPress site'
};
```
