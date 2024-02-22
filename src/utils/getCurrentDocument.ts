import { Document, Model } from 'mongoose';

export const getCurrentDocument = async <T extends Document>(Model: Model<T>, id: string) => {
  try {
    return await Model.findById(id);
  } catch (error) {
    throw new Error(`Error getting current ${Model.modelName}: ${error.message}`);
  }
};
