import assert from 'assert';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as http from 'http';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import nocache from 'nocache';

import getOpenAPIMiddleware from './middlewares/getOpenAPIMiddleware';
import loggerContext from './middlewares/loggerContext.middleware';
import validateAuthorizationKey from './middlewares/validateAuthorizationKey';
import * as operationHandlers from './routes';
import { connectDB } from './services'
import errorMiddleware from './utils/error';
import logger from './utils/logger';
import getSpecUIMiddleware from './utils/spec-ui';

const compression = require('compression')
export class App {
    private readonly app: express.Application;
    private server?: http.Server;
    private httpTerminator?: HttpTerminator;

    constructor({ environment }: { environment?: string }) {
        assert(environment, 'ENVIRONMENT variable is required');

        this.app = express();
    }

    async init() {
        connectDB();
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(nocache());
        this.app.get('/', (_, res) => {
            res.send('✅ API server is running. Visit /api-docs for OpenAPI docs.');
        });
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
        this.app.use(bodyParser.json({ limit: '1mb', type: ['json', '*/json', '+json'] }));
        this.app.use('/api-docs', await getSpecUIMiddleware({ specPath: './src/openapi.yaml' }));
        this.app.use(
            loggerContext(),
            await getOpenAPIMiddleware({
                operationHandlers,
                apiSpecPath: './src/openapi.yaml',
                securityHandlers: {
                    ApiKeyAuth: validateAuthorizationKey,
                },
            })
        );
        this.app.use(errorMiddleware);

        return this.app;
    }

    start() {
        const port = Number(process.env.PORT) || 3000;
        const host = process.env.HOST || '0.0.0.0';

        this.server = this.app.listen(port, host, () => {
            logger.info(`server started on port ${port}`);
        });

        this.httpTerminator = createHttpTerminator({ server: this.server });
    }

    async stop() {
        if (!this.server) {
            logger.info('server does not exist');
            return;
        }

        logger.info('Trying to shutdown the server gracefully');

        await this.httpTerminator?.terminate();
    }
}

export default new App({ environment: process.env.NODE_ENV });
