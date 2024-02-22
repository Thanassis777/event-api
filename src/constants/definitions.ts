import { Query } from 'mongoose';
import { Request } from 'express';

export interface IPhotoSchema {
  imageCover: string;
  images: string[];
}

export interface CustomQuery<T> extends Query<T, string> {
  _conditions: {
    _id?: string;
  };
}

export interface MulterRequest extends Request {
  user: {
    userId: string;
  };
  files: {
    imageCover: Express.Multer.File[];
    images: Express.Multer.File[];
  };
  body: {
    imageCover: string;
    images: string[];
  };
}
