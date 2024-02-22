import ShopCategory from '../models/shopCategoryModel';
import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, updateDocument } from './crudControllers';

export const getAllShopCategories = getAllDocuments(ShopCategory);

export const getShopCategory = getSingleDocument(ShopCategory);

export const createShopCategory = createDocument(ShopCategory);

export const updateShopCategory = updateDocument(ShopCategory);

export const deleteShopCategory = deleteDocument(ShopCategory);
