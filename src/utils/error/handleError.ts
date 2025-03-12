import config from 'config';
import { Logger } from 'winston';

import { Environment } from '../../enums/environment.enum';
import { HttpError } from '../../types/errors';
import getFormattedError from './getFormattedError';

const handleError = (error, { logger }: { logger?: Logger } = {}): Error => {
    let converted = error;

    if (!(converted instanceof HttpError)) {
        converted = getFormattedError(converted);
    }

    logger?.error(converted);

    const environment: string = config.get('environment');

    if (environment !== Environment.LOCALHOST && converted.status >= 500) {
        converted.message = 'Something went wrong';
    }

    return converted;
};

export default handleError;
