import { createServer as createViteServer, ServerOptions } from 'vite';

import { resolveConfig } from './config';
import { createRVPressPlugin } from './plugin';

// create vite dev server for dev
export async function createServer(root: string = process.cwd(), serverOptions: ServerOptions = {}) {
    const config = await resolveConfig(root);

    return createViteServer({
        root: config.srcDir,
        base: config.site.base,
        // logLevel: 'warn',
        plugins: createRVPressPlugin(root, config),
        server: serverOptions
    });
}
