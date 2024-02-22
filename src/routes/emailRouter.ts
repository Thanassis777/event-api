import express from 'express';
import { emailAPI } from '../constants/routeUrls';
import { sendEmail } from '../controllers/emailController';

const emailRouter = express.Router();

emailRouter.route(emailAPI.ROOT_URL).post(sendEmail);

export default emailRouter;
