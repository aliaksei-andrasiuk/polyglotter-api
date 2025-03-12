import { IHttpError } from '../../types/errors';
import handleError from './handleError';

const errorMiddleware = (error, req, res, _next) => {
    const formattedError = <IHttpError>handleError(error, { logger: req.context?.logger });

    res.status(formattedError.status).json({
        status: formattedError.status,
        message: formattedError.message,
        data: formattedError.data,
    });
};

export default errorMiddleware;
