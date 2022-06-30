declare const __CARBON__: boolean;
declare const __BSA__: boolean;
declare const __ALGOLIA__: boolean;

// this module's typing is broken
declare module '@docsearch/js' {
    function docsearch<T = any>(props: T): void;
    export default docsearch;
}

declare module '@docsearch/css' {
    const css: string;
    export default css;
}
