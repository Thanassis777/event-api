import express from 'express';

import { eventAPI } from '../constants/routeUrls';
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from '../controllers/eventController';
import { validateEventShopOwnership } from '../helpers/shop.helper';
import { authorizeUser } from '../middlewares/authorizeUser';
import { uploadImages } from '../middlewares/uploadImages';
import { persistImages } from '../middlewares/persistImages';

const eventRouter = express.Router({ mergeParams: true });

eventRouter.route(eventAPI.ROOT_URL).get(getAllEvents).post(authorizeUser, uploadImages, persistImages, createEvent);
eventRouter
  .route(eventAPI.IDS_URL)
  .get(getEvent)
  .patch(authorizeUser, validateEventShopOwnership, uploadImages, persistImages, updateEvent)
  .delete(authorizeUser, validateEventShopOwnership, deleteEvent);

export default eventRouter;
