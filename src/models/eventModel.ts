import mongoose, { Document, model, Schema } from 'mongoose';

import { commonSchemaHooks } from '../middlewares/commonSchemaHooks';
import { IShopSchema } from './shopModel';
import { IPhotoSchema } from '../constants/definitions';
import { ICategorySchema } from './categoryModel';

export interface IEventSchema extends IPhotoSchema, Document {
  title: string;
  active: boolean;
  description: string;
  reservations: string;
  menu: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;

  shop: IShopSchema;

  categories: ICategorySchema;
}

const eventSchema = new Schema<IEventSchema>({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 40,
  },
  active: {
    type: Boolean,
    required: true,
  },
  description: {
    type: String,
    minlength: 1,
    maxlength: 200,
  },
  reservations: {
    type: String,
  },
  menu: {
    type: String,
  },
  imageCover: {
    type: String,
    default: 'event-default.jpeg',
    required: false,
  },
  images: [String],
  startDate: {
    type: Date,
    default: Date.now(),
  },
  endDate: {
    type: Date,
    default: Date.now(),
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventCategory',
    },
  ],
});

commonSchemaHooks(eventSchema);

export default model<IEventSchema>('Event', eventSchema);
