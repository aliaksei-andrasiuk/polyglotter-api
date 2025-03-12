import { RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';

import getSpecDefinitions from './getSpecDefinitions';
import getSpecUIMiddleware from './getSpecUIMiddleware';

jest.mock('swagger-ui-express', () => ({
    serveFiles: jest.fn(),
    setup: jest.fn(),
}));
jest.mock('./getSpecDefinitions', () => jest.fn());

describe('getSpecUIMiddleware', () => {
    let middleware;
    const mocks = {
        specPath: './specPath',
        specDefinitions: 'specDefinitions',
        serveMiddleware: jest.fn() as RequestHandler,
        setupMiddleware: jest.fn() as RequestHandler,
    };

    beforeAll(() => {
        (getSpecDefinitions as jest.Mock).mockResolvedValue(mocks.specDefinitions);
        (swaggerUi.serveFiles as jest.Mock).mockReturnValue(mocks.serveMiddleware);
        (swaggerUi.setup as jest.Mock).mockReturnValue(mocks.setupMiddleware);
    });
    beforeEach(async () => {
        middleware = await getSpecUIMiddleware({ specPath: mocks.specPath });
    });

    it('spec definitions should be loaded correctly', () => {
        expect(getSpecDefinitions).toHaveBeenCalledTimes(1);
        expect(getSpecDefinitions).toHaveBeenCalledWith(mocks.specPath);
    });

    it('serve middleware should be initialized correctly', () => {
        expect(swaggerUi.serveFiles).toHaveBeenCalledTimes(1);
        expect(swaggerUi.serveFiles).toHaveBeenCalledWith(mocks.specDefinitions);
    });

    it('setup middleware should be initialized correctly', () => {
        expect(swaggerUi.setup).toHaveBeenCalledTimes(1);
        expect(swaggerUi.setup).toHaveBeenCalledWith(mocks.specDefinitions);
    });

    it('UI middleware should be returned correctly', () => {
        expect(middleware).toEqual([mocks.serveMiddleware, mocks.setupMiddleware]);
    });
});
