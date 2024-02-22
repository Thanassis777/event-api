import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes } from '../constants/statusCodes';
import { catchAsyncError } from '../middlewares/catchAsyncError';
import Event from '../models/eventModel';
import Shop from '../models/shopModel';
import User from '../models/userModel';
import { getCurrentDocument } from '../utils/getCurrentDocument';

// Validate that user exists and shop belongs to it
export const validateUserShopOwnership = catchAsyncError(async (req, res, next) => {
  const { userId, id: shopId } = req.params;

  const currUser = await getCurrentDocument(User, userId);
  if (!currUser) return next(generateErrorMsg('User does not exist', StatusCodes.BAD_REQUEST));

  const hasMatchingShopId = currUser.shops.some((shop) => shop.id === shopId);

  if (!hasMatchingShopId)
    return next(generateErrorMsg('This shop does not belong to this user', StatusCodes.BAD_REQUEST));

  next();
});

export const validateEventShopOwnership = catchAsyncError(async (req, res, next) => {
  const { shopId, id: eventId } = req.params;

  const currEvent = await getCurrentDocument(Event, eventId);
  if (!currEvent) return next(generateErrorMsg('Event does not exist', StatusCodes.BAD_REQUEST));

  const currShop = await getCurrentDocument(Shop, shopId);
  if (!currShop) return next(generateErrorMsg('Shop does not exist', StatusCodes.BAD_REQUEST));

  const hasMatchingShopId = currEvent.shop.toString() === shopId;

  if (!hasMatchingShopId)
    return next(generateErrorMsg('This event does not belong to this shop', StatusCodes.BAD_REQUEST));

  next();
});
