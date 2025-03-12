import { SearchConfigsModel } from '../models'
import { ConflictError, ICreateSearchConfig } from '../types';

export const createSearchConfig = async (config: ICreateSearchConfig) => {
    const existingConfig = await SearchConfigsModel.findOne({ userId: config.userId });

    if (!!existingConfig) {
        throw new ConflictError({ message: 'Config for this user is already exist' });
    }

    const data = new SearchConfigsModel(config)

    const dataToSave = data.save();

    return dataToSave
};