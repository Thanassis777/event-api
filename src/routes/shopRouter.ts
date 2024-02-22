import express from 'express';

import { createShop, deleteShop, getAllShops, getShop, updateShop } from '../controllers/shopController';
import { shopAPI } from '../constants/routeUrls';
import { authorizeUser } from '../middlewares/authorizeUser';
import { validateUserShopOwnership } from '../helpers/shop.helper';
import eventRouter from './eventRouter';
import { uploadImages } from '../middlewares/uploadImages';
import { persistImages } from '../middlewares/persistImages';

const shopRouter = express.Router({ mergeParams: true });

shopRouter.use(shopAPI.NESTED_EVENT_URL, eventRouter);

shopRouter.route(shopAPI.ROOT_URL).get(getAllShops).post(authorizeUser, uploadImages, persistImages, createShop);
shopRouter
  .route(shopAPI.IDS_URL)
  .get(getShop)
  .patch(authorizeUser, validateUserShopOwnership, uploadImages, persistImages, updateShop)
  .delete(authorizeUser, validateUserShopOwnership, deleteShop);

export default shopRouter;
