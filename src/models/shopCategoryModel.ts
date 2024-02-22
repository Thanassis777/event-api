import { model, Schema } from 'mongoose';

import { ICategorySchema } from './categoryModel';
import categorySchema from './categoryModel';
import { commonSchemaHooks } from '../middlewares/commonSchemaHooks';
import { CustomQuery } from '../constants/definitions';
import { IShopSchema } from './shopModel';

export interface IShopCategorySchema extends ICategorySchema {
  // You can add additional fields specific to IShopCategoriesSchema here
}

const shopCategorySchema = new Schema<IShopCategorySchema>({
  ...categorySchema.obj, // Include the common fields
});

commonSchemaHooks(shopCategorySchema);

shopCategorySchema.post<CustomQuery<IShopSchema>>('findOneAndDelete', async function (next) {
  // 'this' refers to the document being deleted
  const categoryId = this._conditions._id;

  // Update the shops which have this category and remove it from their 'categories' array
  await model('Shop').updateMany({ categories: categoryId }, { $pull: { categories: categoryId } });
});

export default model<IShopCategorySchema>('ShopCategory', shopCategorySchema);
