import React, { ReactNode } from 'react';

const inBrowser = typeof window !== 'undefined';

export default ({ children }: { children: ReactNode }) => {
    return inBrowser ? <React.Suspense fallback={null}>{children}</React.Suspense> : null;
};
