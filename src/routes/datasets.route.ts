import { RequestHandler } from "express";

import { prisma } from "../services";

export const getDataset: RequestHandler = async (_, res, next) => {
    try {
        const dataset = await prisma.phraseMapping.findMany();

        res.status(200).json({
            status: 200,
            data: dataset,
        });
    } catch (error) {
        next(error);
    }
}
