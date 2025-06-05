import { Logger } from 'winston';

import getFormattedError from './getFormattedError';
import { Environment } from '../../types/enums/environment.enum';
import { HttpError } from '../../types/errors';

const handleError = (error, { logger }: { logger?: Logger } = {}): Error => {
    let converted = error;

    if (!(converted instanceof HttpError)) {
        converted = getFormattedError(converted);
    }

    logger?.error(converted);

    if (process.env.NODE_ENV !== Environment.LOCALHOST && converted.status >= 500) {
        converted.message = 'Something went wrong';
    }

    return converted;
};

export default handleError;
