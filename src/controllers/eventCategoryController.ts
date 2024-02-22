import EventCategory from '../models/eventCategoryModel';
import { createDocument, deleteDocument, getAllDocuments, getSingleDocument, updateDocument } from './crudControllers';

export const getAllEventCategories = getAllDocuments(EventCategory);

export const getEventCategory = getSingleDocument(EventCategory);

export const createEventCategory = createDocument(EventCategory);

export const updateEventCategory = updateDocument(EventCategory);

export const deleteEventCategory = deleteDocument(EventCategory);
