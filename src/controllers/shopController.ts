import Shop from '../models/shopModel';
import User from '../models/userModel';
import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, updateDocument } from './crudControllers';
import { catchAsyncError } from '../middlewares/catchAsyncError';
import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes } from '../constants/statusCodes';
import { getCurrentDocument } from '../utils/getCurrentDocument';
import ShopCategory from '../models/shopCategoryModel';

export const getAllShops = getAllDocuments(Shop);

export const getShop = getSingleDocument(Shop, [{ path: 'events' }, { path: 'categories' }]);

export const createShop = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  const { categories: shopCategories = [] } = req.body;

  const currUser = await getCurrentDocument(User, userId);
  if (!currUser) return next(generateErrorMsg('Shop can not be added in non existing user', StatusCodes.BAD_REQUEST));

  // Check if categories exist
  for (const category of shopCategories) {
    const shopCategory = await getCurrentDocument(ShopCategory, category);
    if (!shopCategory) {
      return next(generateErrorMsg('Shop can not be created with non-existing categories', StatusCodes.BAD_REQUEST));
    }
  }

  createDocument(Shop, User, userId, 'shops')(req, res, next);
});

export const updateShop = updateDocument(Shop);

export const deleteShop = deleteDocument(Shop);
