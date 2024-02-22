import express from 'express';
import { forgotPassword, loginUser, registerUser, updatePassword, resetPassword } 
    from '../controllers/authController';
import { authApi } from '../constants/routeUrls';
import { authorizeUser } from '../middlewares/authorizeUser';
import { validateForgotPasswordReq } from '../middlewares/validateForgotPasswordReq';

const authRouter = express.Router();

authRouter.route(authApi.REGISTER_URL).post(registerUser);
authRouter.route(authApi.LOGIN_URL).post(loginUser);
authRouter.route(authApi.UPDATE_PASSWORD_URL).patch(authorizeUser, updatePassword);
authRouter.route(authApi.FORGOT_PASSWORD_URL).post(validateForgotPasswordReq, forgotPassword);
authRouter.route(authApi.RESET_PASSWORD_URL).patch(authorizeUser, resetPassword);

export default authRouter;

