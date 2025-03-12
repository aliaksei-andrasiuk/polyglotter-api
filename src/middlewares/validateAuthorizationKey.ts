import config from 'config';
import { Request } from 'express';

const validateAuthorizationKey = (req: Request): boolean => {
    return req.headers['x-api-key'] === config.get('apiAccessKey');
};

export default validateAuthorizationKey;
