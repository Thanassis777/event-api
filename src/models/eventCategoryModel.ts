import { model, Schema } from 'mongoose';

import categorySchema, { ICategorySchema } from './categoryModel';
import { commonSchemaHooks } from '../middlewares/commonSchemaHooks';
import { CustomQuery } from '../constants/definitions';
import { IEventSchema } from './eventModel';

export interface IEventCategorySchema extends ICategorySchema {
  // You can add additional fields specific to IShopCategoriesSchema here
}

const eventCategorySchema = new Schema<IEventCategorySchema>({
  ...categorySchema.obj, // Include the common fields
});

commonSchemaHooks(eventCategorySchema);

eventCategorySchema.post<CustomQuery<IEventSchema>>('findOneAndDelete', async function (next) {
  // 'this' refers to the document being deleted
  const categoryId = this._conditions._id;
  // Update the shops which have this category and remove it from their 'categories' array
  await model('Event').updateMany({ categories: categoryId }, { $pull: { categories: categoryId } });
});


export default model<IEventCategorySchema>('EventCategory', eventCategorySchema);
