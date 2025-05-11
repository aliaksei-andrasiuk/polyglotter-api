import handleError from './handleError';
import { IHttpError } from '../../types/errors';

const errorMiddleware = (error, req, res, _next) => {
    const formattedError = <IHttpError>handleError(error, { logger: req.context?.logger });

    res.status(formattedError.status).json({
        status: formattedError.status,
        message: formattedError.message,
        data: formattedError.data,
    });
};

export default errorMiddleware;
