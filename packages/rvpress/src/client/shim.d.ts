declare const __RVP_HASH_MAP__: Record<string, string>;

declare module '@siteData' {
    const data: string;
    export default data;
}

declare module '@pageList' {
    const data: string;
    export default data;
}

declare module '@theme' {
    const NotFound: React.FunctionComponent | React.ClassicComponent;
    const Layout: React.FunctionComponent | React.ClassicComponent;
    const Theme: {
        NotFound;
        Layout;
    };
    export default Theme;
}
