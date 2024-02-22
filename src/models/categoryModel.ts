import { Document, Schema } from 'mongoose';

export interface ICategorySchema extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
export default categorySchema;
