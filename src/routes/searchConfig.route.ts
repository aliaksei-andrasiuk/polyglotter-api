import { RequestHandler } from 'express';

import * as searchConfigController from '../controllers/searchConfig.controller';

export const createSearchConfig: RequestHandler = async (req, res, next) => {
    try {
        await searchConfigController.createSearchConfig(req.body);

        res.status(201).json({
            status: 201,
            message: 'ok bratan, vse good'
        });
    } catch (error) {
        next(error);
    }
};
