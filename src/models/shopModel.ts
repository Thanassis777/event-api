import mongoose, { Document, model, Schema } from 'mongoose';
import validator from 'validator';

import { commonSchemaHooks } from '../middlewares/commonSchemaHooks';
import { CustomQuery, IPhotoSchema } from '../constants/definitions';
import { ICategorySchema } from './categoryModel';

export interface IShopSchema extends IPhotoSchema, Document {
  name: string;
  city: string;
  street: string;
  number: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  phone: number;
  shopLink: string;
  socialURLs: string[];
  createdAt: Date;
  updatedAt: Date;

  categories: ICategorySchema[];

  // TODO: implement in future development
  // category: string;
}

const shopSchema = new Schema<IShopSchema>(
  {
    name: {
      type: String,
      // required: true,
      minlength: 1,
      maxlength: 20,
    },
    city: {
      type: String,
      // required: true,
      minlength: 1,
      maxlength: 20,
    },
    street: {
      type: String,
      // required: true,
      minlength: 1,
      maxlength: 20,
      validate: {
        validator: (value: string) => validator.isAlphanumeric(value),
      },
    },
    number: {
      type: String,
      // required: true,
      minlength: 1,
      maxlength: 5,
    },
    postalCode: {
      type: String,
      // required: true,
      validate: {
        validator: (value: string) => validator.isPostalCode(value, 'GR'),
      },
    },
    state: {
      type: String,
      // required: true,
      validate: {
        validator: (value: string) => validator.isAlpha(value),
      },
    },
    taxNumber: {
      type: String,
      // required: true,
      validate: {
        validator: (value: string) => validator.isTaxID(value, 'el-GR'),
      },
    },
    phone: {
      type: Number,
      // required: true,
      minlength: 10,
      maxlength: 10,
    },
    shopLink: {
      type: String,
      // required: true,
      validate: {
        validator: (value: string) => validator.isURL(value),
      },
    },
    imageCover: {
      type: String,
      default: 'shop-default.jpeg',
      // required: true,
    },
    images: [String],
    socialURLs: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShopCategory',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
  }
);

shopSchema.virtual('events', {
  ref: 'Event', // The name of the model to populate
  localField: '_id', // The local field to use for matching
  foreignField: 'shop', // The foreign field in the Event model
  justOne: false, // Set to true if you expect only one event, or false for an array
});

commonSchemaHooks(shopSchema);

// Remove references from users when deleting a shop!
shopSchema.post<CustomQuery<IShopSchema>>('findOneAndDelete', async function (next) {
  // 'this' refers to the document being deleted
  const shopId = this._conditions._id;

  // Update the users who reference this shop and remove it from their 'shops' array
  await model('User').updateMany({ shops: shopId }, { $pull: { shops: shopId } });

  // If we delete a shop, then we delete all the events that shop had.
  await model('Event').deleteMany({ shop: shopId });
});

export default model<IShopSchema>('Shop', shopSchema);
