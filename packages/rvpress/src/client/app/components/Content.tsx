import React, { HTMLAttributes } from 'react';

import { useRoute } from '../router';

const Content = (props: HTMLAttributes<HTMLDivElement>) => {
    const route = useRoute();

    return (
        <div style={{ position: 'relative' }} {...props}>
            {route.component}
        </div>
    );
};

export default React.memo(Content);
