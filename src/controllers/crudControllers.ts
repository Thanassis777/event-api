import { NextFunction, Request, Response } from 'express';
import { Document, Model, PopulateOptions } from 'mongoose';

import { catchAsyncError } from '../middlewares/catchAsyncError';
import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes, StatusTypes } from '../constants/statusCodes';

export const getAllDocuments = <T extends Document>(Model: Model<T>) =>
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const docs = await Model.find();

    if (!docs) return next(generateErrorMsg('No documents found', StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({
      status: StatusTypes.SUCCESS,
      results: docs.length,
      data: docs,
    });
  });

export const getSingleDocument = <T extends Document>(
  Model: Model<T>,
  popOptions?: PopulateOptions | PopulateOptions[]
) =>
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    // @ts-ignore
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(generateErrorMsg('No document found', StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({
      status: StatusTypes.SUCCESS,
      data: doc,
    });
  });

export const createDocument = <T extends Document, S extends Document>(
  Model: Model<T>,
  ModelToUpdate?: Model<S>,
  modelId?: string,
  fieldToUpdate?: string
) =>
  catchAsyncError(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    if (ModelToUpdate) {
      const updateObj: Record<string, any> = {};
      updateObj[fieldToUpdate] = newDoc._id;

      await ModelToUpdate.findByIdAndUpdate(modelId, { $push: updateObj }, { new: true, useFindAndModify: false });
    }

    newDoc.__v = undefined;

    res.status(StatusCodes.CREATED).json({
      status: StatusTypes.SUCCESS,
      data: newDoc,
    });
  });

export const updateDocument = <T extends Document>(Model: Model<T>) =>
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(generateErrorMsg('No document with that ID found to update!', StatusCodes.NOT_FOUND));

    res.status(StatusCodes.OK).json({
      status: StatusTypes.SUCCESS,
      data: doc,
    });
  });

export const deleteDocument = <T extends Document>(Model: Model<T>) =>
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(generateErrorMsg('No document with that ID found to delete!', StatusCodes.NOT_FOUND));

    res.status(StatusCodes.NO_CONTENT).json({
      status: StatusTypes.SUCCESS,
    });
  });
