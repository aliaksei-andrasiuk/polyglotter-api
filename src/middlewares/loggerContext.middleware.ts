import { NextFunction, Request } from 'express';
import { v4 } from 'node-uuid';

import logger from '../utils/logger';
import { IRequestInfo } from '../utils/logger/logger';

const loggerContext =
    () =>
    (req: Request, _res, next: NextFunction): void => {
        const requestID = v4();

        const reqInfo: IRequestInfo = {
            id: requestID,
            method: req.method,
            path: req.path,
            ip: req.ip as string,
            ips: req.ips,
        };

        const childLogger = logger.child({ req: reqInfo });

        req['context'] = { ...req['context'], logger: childLogger };

        next();
    };

export default loggerContext;
