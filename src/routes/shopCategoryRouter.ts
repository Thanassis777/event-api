import express from 'express';
import { shopCategoryAPI } from '../constants/routeUrls';
import {
  createShopCategory,
  deleteShopCategory,
  getAllShopCategories,
  getShopCategory,
  updateShopCategory,
} from '../controllers/shopCategoryController';

const shopCategoryRouter = express.Router();

shopCategoryRouter.route(shopCategoryAPI.ROOT_URL).get(getAllShopCategories).post(createShopCategory);
shopCategoryRouter
  .route(shopCategoryAPI.IDS_URL)
  .get(getShopCategory)
  .patch(updateShopCategory)
  .delete(deleteShopCategory);

export default shopCategoryRouter;
