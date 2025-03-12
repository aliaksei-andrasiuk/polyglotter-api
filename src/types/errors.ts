interface IFormattedHttpError {
    name?: string;
    message: string;
    isOperational?: boolean;
    errors?: string[];
    data?: unknown;
}

export interface IHttpError extends IFormattedHttpError {
    status: number;
}

export class HttpError extends Error {
    readonly name: string = 'HttpError';
    readonly status: number;
    readonly errorName?: string;
    readonly isOperational?: boolean;
    readonly errors?: string[];
    readonly data?: unknown;

    constructor({ message, status, isOperational, errors, data }: IHttpError) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.status = status;
        this.isOperational = isOperational ?? true;
        this.errors = errors;
        this.data = data;

        Error.captureStackTrace(this, HttpError);
    }
}

export class BadRequestError extends HttpError {
    readonly name: string = 'BadRequestError';

    constructor({ message = 'Bad Request', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 400,
        });
    }
}

export class UnauthorizedError extends HttpError {
    readonly name: string = 'UnauthorizedError';

    constructor({ message = 'Unauthorized', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 401,
        });
    }
}

export class ForbiddenError extends HttpError {
    readonly name: string = 'ForbiddenError';

    constructor({ message = 'Forbidden', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 403,
        });
    }
}

export class NotFoundError extends HttpError {
    readonly name: string = 'NotFoundError';

    constructor({ message = 'Not Found', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 404,
        });
    }
}

export class MethodNotAllowedError extends HttpError {
    readonly name: string = 'MethodNotAllowedError';

    constructor({
        message = 'Method Not Allowed',
        isOperational,
        errors,
        data,
    }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 405,
        });
    }
}

export class ConflictError extends HttpError {
    readonly name: string = 'ConflictError';

    constructor({ message = 'Conflict', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 409,
        });
    }
}

export class InternalServerError extends HttpError {
    readonly name: string = 'InternalServerError';

    constructor({
        message = 'Internal Server Error',
        isOperational,
        errors,
        data,
    }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 500,
        });
    }
}

export class BadGatewayError extends HttpError {
    readonly name: string = 'BadGatewayError';

    constructor({ message = 'Bad Gateway', isOperational, errors, data }: IFormattedHttpError) {
        super({
            message,
            errors,
            data,
            isOperational,
            status: 502,
        });
    }
}
export type CustomError =
    | typeof BadRequestError
    | typeof UnauthorizedError
    | typeof ForbiddenError
    | typeof NotFoundError
    | typeof MethodNotAllowedError
    | typeof ConflictError
    | typeof InternalServerError
    | typeof BadGatewayError;

export const errorTypes = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    MethodNotAllowedError,
    ConflictError,
    InternalServerError,
    BadGatewayError,
};
