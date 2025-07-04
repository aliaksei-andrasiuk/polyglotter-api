import { Request } from 'express';
import { createLogger, format, transports } from 'winston';

import formatter from './formatter';
import { Environment } from '../../types/enums/environment.enum';

export interface IRequestInfo {
    id: string;
    method: string;
    path: string;
    ip: string;
    ips: string[];
    route?: string;
    params?: Request['params'];
}

export const initLogger = (environment = Environment.LOCALHOST) => {
    const isDevelopment = environment === Environment.LOCALHOST;

    const logger = createLogger({
        level: 'info',
        defaultMeta: {
            service: process.env['npm_package_name'],
            version: process.env['npm_package_version'],
        },
    });

    logger.add(
        isDevelopment
            ? new transports.Console({
                  format: format.combine(format.colorize(), format.simple()),
              })
            : new transports.Console({
                  format: format.combine(
                      formatter,
                      format.timestamp({
                          format: 'YYYY-MM-DD HH:mm:ss',
                      }),
                      format.errors({ stack: true }),
                      format.splat(),
                      format.json()
                  ),
              })
    );

    return logger;
};

export default initLogger(process.env.NODE_ENV as Environment);
