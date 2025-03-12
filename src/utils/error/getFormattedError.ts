import { errorTypes, IHttpError, CustomError } from '../../types/errors';

const getErrorStatus = (error): number => Number(error.status || error.statusCode);
const getErrorMessage = (error): string => error?.response?.body?.message ?? error.message;
const getOperationalStatus = (error): boolean => error?.isOperational ?? false;

export const getErrorConstructor = (error): CustomError => {
    switch (getErrorStatus(error)) {
        case 400: {
            return errorTypes.BadRequestError;
        }
        case 401: {
            return errorTypes.UnauthorizedError;
        }
        case 403: {
            return errorTypes.ForbiddenError;
        }
        case 404: {
            return errorTypes.NotFoundError;
        }
        case 405: {
            return errorTypes.MethodNotAllowedError;
        }
        case 409: {
            return errorTypes.ConflictError;
        }
        case 500: {
            return errorTypes.InternalServerError;
        }
        case 502: {
            return errorTypes.BadGatewayError;
        }
        default: {
            return errorTypes.InternalServerError;
        }
    }
};

const getFormattedError = (error: unknown): IHttpError => {
    const ErrorConstructor = getErrorConstructor(error);
    return new ErrorConstructor({
        message: getErrorMessage(error),
        isOperational: getOperationalStatus(error),
        data: error,
    });
};

export default getFormattedError;
