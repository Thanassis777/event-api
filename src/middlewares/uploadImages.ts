import multer, { StorageEngine } from 'multer';

import { StatusCodes } from '../constants/statusCodes';
import { Request } from 'express';
import generateErrorMsg from '../utils/generateErrorMsg';

//  save image in memory as a buffer
const multerStorage: StorageEngine = multer.memoryStorage();

// filter only type: image to be acceptable
const multerFilter = (req: Request, file: Express.Multer.File, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(generateErrorMsg('Not an image!Please upload only images', StatusCodes.NOT_FOUND), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// middleware for uploading images
export const uploadImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);
