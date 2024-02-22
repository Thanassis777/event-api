import fs from 'fs';
import sharp from 'sharp';

import { catchAsyncError } from './catchAsyncError';
import { MulterRequest } from '../constants/definitions';
import { NextFunction, Response } from 'express';

// Check if the directory exists and create it if not
const checkAndCreateDirectory = (saveDirectory: string) => {
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory, { recursive: true });
  }
};

const resizeAndSaveFile = async (fileToSave: Buffer, destinationFile: string) => {
  await sharp(fileToSave)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 }) // percentage of quality
    .toFile(destinationFile);
};

// middleware for processing images
export const persistImages = catchAsyncError(async (req: MulterRequest, res: Response, next: NextFunction) => {
  const { userId } = res.locals;

  // handle separately the image folders regarding request
  const imageFolder = req.baseUrl.includes('event') ? 'event' : 'shop';

  // Define the directory where you want to save the images
  const saveDirectory = `public/img/${imageFolder}`;
  if (!req.files || !req.files.imageCover) req.body.imageCover = undefined;
  else {
    // Profile image, set this field for persistence later in DB
    req.body.imageCover = `${imageFolder}-${userId}-${Date.now()}.jpeg`;
    const destinationFile = `${saveDirectory}/${req.body.imageCover}`;

    checkAndCreateDirectory(saveDirectory);
    await resizeAndSaveFile(req.files.imageCover[0].buffer, destinationFile);
  }

  if (!req.files || !req.files.images) req.body.images = [];
  else {
    // Images
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `${imageFolder}-${userId}-${Date.now()}-${i + 1}.jpeg`;
        const destinationFile = `${saveDirectory}/${filename}`;

        checkAndCreateDirectory(saveDirectory);
        await resizeAndSaveFile(file.buffer, destinationFile);

        req.body.images.push(filename);
      })
    );
  }

  next();
});
