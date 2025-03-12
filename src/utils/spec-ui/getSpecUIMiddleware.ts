import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';

import getSpecDefinitions from './getSpecDefinitions';

const getSpecUIMiddleware = async ({
    specPath,
}: {
    specPath: string;
}): Promise<RequestHandler[]> => {
    const specDefinitions = await getSpecDefinitions(specPath);

    return [swaggerUi.serveFiles(specDefinitions), swaggerUi.setup(specDefinitions)];
};

export default getSpecUIMiddleware;
