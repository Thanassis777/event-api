import express from 'express';
import { eventCategoryAPI } from '../constants/routeUrls';
import {
  createEventCategory,
  deleteEventCategory,
  getAllEventCategories,
  getEventCategory,
  updateEventCategory,
} from '../controllers/eventCategoryController';

const eventCategoryRouter = express.Router();

eventCategoryRouter.route(eventCategoryAPI.ROOT_URL).get(getAllEventCategories).post(createEventCategory);
eventCategoryRouter
  .route(eventCategoryAPI.IDS_URL)
  .get(getEventCategory)
  .patch(updateEventCategory)
  .delete(deleteEventCategory);

export default eventCategoryRouter;
