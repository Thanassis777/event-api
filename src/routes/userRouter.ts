import express from 'express';
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController';
import { userAPI } from '../constants/routeUrls';
import shopRouter from './shopRouter';

const userRouter = express.Router();

userRouter.use(userAPI.NESTED_SHOP_URL, shopRouter);

userRouter.route(userAPI.ROOT_URL).get(getAllUsers);
userRouter.route(userAPI.IDS_URL).get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
