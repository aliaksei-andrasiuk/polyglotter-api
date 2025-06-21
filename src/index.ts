import * as dotenv from 'dotenv';
import { resolve } from 'path';

import { setHandleShutdown } from './utils/registerGracefulShutdown';

if (!process.env.NODE_ENV) {
    dotenv.config({ path: resolve(__dirname, '../docker/.env.local') });
}

import app from './app';

(async () => {
    await app.init();
    app.start();

    setHandleShutdown(app.stop.bind(app));
})();
