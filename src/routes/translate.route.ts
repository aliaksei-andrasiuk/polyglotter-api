import { RequestHandler } from 'express';

import * as controller from '../controllers';

export const processAndTranslate: RequestHandler = async (req, res, next) => {
    try {
        const data = await controller.processAndTranslate(req.body.text);

        res.status(200).json({
            status: 200,
            data,
        });
    } catch (error) {
        next(error);
    }
};
