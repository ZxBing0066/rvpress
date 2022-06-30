import React, { ReactNode } from 'react';

const ClientOnly = ({ children }: { children: ReactNode }) => {
    return typeof window === undefined ? null : <>{children}</>;
};

export default React.memo(ClientOnly);
