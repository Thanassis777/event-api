import Event from '../models/eventModel';
import Shop from '../models/shopModel';
import EventCategory from '../models/eventCategoryModel';
import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, updateDocument } from './crudControllers';
import { catchAsyncError } from '../middlewares/catchAsyncError';
import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes } from '../constants/statusCodes';
import { getCurrentDocument } from '../utils/getCurrentDocument';

export const getAllEvents = getAllDocuments(Event);

export const getEvent = getSingleDocument(Event, {
  path: 'shop',
  select: '-events',
  populate: {
    path: 'categories',
  },
});

export const createEvent = catchAsyncError(async (req, res, next) => {
  const { shopId } = req.params;
  const { categories: eventCategories = [] } = req.body;

  // Add shopid to the event at the shop field
  const currShop = await getCurrentDocument(Shop, shopId);
  if (!currShop) return next(generateErrorMsg('Event can not be added in non existing shop', StatusCodes.BAD_REQUEST));
  req.body.shop = shopId;

  // Check if categories exist
  for (const category of eventCategories) {
    const eventCategory = await getCurrentDocument(EventCategory, category);
    if (!eventCategory) {
      return next(generateErrorMsg('Event can not be created with non-existing categories', StatusCodes.BAD_REQUEST));
    }
  }
  createDocument(Event)(req, res, next);
});

export const updateEvent = updateDocument(Event);

export const deleteEvent = deleteDocument(Event);
