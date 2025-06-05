import { Request } from 'express';

const validateAuthorizationKey = (_req: Request): boolean => {
    // return req.headers['x-api-key'] === config.get('apiAccessKey');
    return true
};

export default validateAuthorizationKey;
