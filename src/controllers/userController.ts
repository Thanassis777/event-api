import User from '../models/userModel';
import { deleteDocument, getAllDocuments, getSingleDocument, updateDocument } from './crudControllers';
import { catchAsyncError } from '../middlewares/catchAsyncError';
import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes } from '../constants/statusCodes';

export const getAllUsers = getAllDocuments(User);

export const getUser = getSingleDocument(User);

export const updateUser = catchAsyncError(async (req, res, next) => {
  // the update of the password can only be done through auth and not through update user
  if ('password' in req.body)
    return next(generateErrorMsg('Updating the password field is not allowed', StatusCodes.BAD_REQUEST));

  updateDocument(User)(req, res, next);
});

export const deleteUser = deleteDocument(User);
