import { Request, RequestHandler } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';

import { getSpecDefinitions } from '../utils/spec-ui';

type OperationHandlers = {
    [operationId: string]: RequestHandler;
};

type SecurityHandlers = {
    [securityHandlerId: string]: (req: Request, scopes: string[]) => boolean | Promise<boolean>;
};

export const getOperationHandlers = operationHandlers => {
    const resolver = (_dependencies, route, apiDoc) => {
        const pathKey = route.openApiRoute.substring(route.basePath.length);
        const schema = apiDoc.paths[pathKey][route.method.toLowerCase()];
        if (!operationHandlers[schema.operationId]) {
            throw new Error(
                `Failed to find a handler when trying to route [${route.method} ${route.expressRoute}].`
            );
        }

        return (req, res, next) => {
            if (req.context?.logger) {
                req.context.logger = req.context.logger.child({
                    reqInfo: {
                        route: schema.operationId,
                        params: req.params,
                    },
                });

                req.context.logger.info('Processing new request');
            }

            return operationHandlers[schema.operationId](req, res, next);
        };
    };
    return {
        basePath: __dirname,
        resolver,
    };
};

export const stringToLowerCase = (value: string) => value.trim().toLowerCase();

const getOpenAPIMiddleware = async ({
    apiSpecPath,
    operationHandlers,
    securityHandlers,
    enableResponseValidation = true,
    enableFilesUpload = false,
}: {
    apiSpecPath: string;
    operationHandlers: OperationHandlers;
    securityHandlers: SecurityHandlers;
    enableResponseValidation?: boolean;
    enableFilesUpload?: boolean;
}) =>
    OpenApiValidator.middleware({
        apiSpec: await getSpecDefinitions(apiSpecPath),
        validateResponses: enableResponseValidation,
        validateSecurity: {
            handlers: securityHandlers,
        },
        serDes: [
            {
                format: 'username',
                deserialize: stringToLowerCase,
            },
            {
                format: 'domain',
                deserialize: stringToLowerCase,
            },
            {
                format: 'region',
                deserialize: stringToLowerCase,
            },
        ],
        operationHandlers: getOperationHandlers(operationHandlers),
        fileUploader: enableFilesUpload,
    });

export default getOpenAPIMiddleware;
