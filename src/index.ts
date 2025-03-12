process.env.NODE_CONFIG_DIR = './src/config';

import app from './app';
import { setHandleShutdown } from './utils/registerGracefulShutdown';

(async () => {
    await app.init();
    app.start();

    setHandleShutdown(app.stop.bind(app));
})();
