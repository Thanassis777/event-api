import express from 'express';
import path from 'path';

import eventCategoryRouter from './routes/eventCategoryRouter';
import shopCategoryRouter from './routes/shopCategoryRouter';
import userRouter from './routes/userRouter';
import shopRouter from './routes/shopRouter';
import eventRouter from './routes/eventRouter';
import authRouter from './routes/authRouter';
import emailRouter from './routes/emailRouter';

import generateErrorMsg from './utils/generateErrorMsg';
import { globalErrorHandler } from './controllers/errorController';
import { StatusCodes } from './constants/statusCodes';
import {
  authApi,
  emailAPI,
  eventAPI,
  eventCategoryAPI,
  shopAPI,
  shopCategoryAPI,
  userAPI,
} from './constants/routeUrls';

const app = express();

// serve static files directory "public"
app.use(express.static('public'));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

/* Body parser, reading data from body into req.body */
app.use(express.json({ limit: '10kb' }));

app.use(authApi.BASE_URL, authRouter);

app.use(userAPI.BASE_URL, userRouter);
app.use(shopAPI.BASE_URL, shopRouter);
app.use(eventAPI.BASE_URL, eventRouter);

app.use(eventCategoryAPI.BASE_URL, eventCategoryRouter);
app.use(shopCategoryAPI.BASE_URL, shopCategoryRouter);

app.use(emailAPI.BASE_URL, emailRouter);

// Route handler, used as a fallback, for any URL path that are not explicitly defined by other route handlers in app
app.all('*', (req, res, next) => {
  next(generateErrorMsg(`Can't find ${req.originalUrl} on this server!`, StatusCodes.NOT_FOUND));
});

// Middleware used to catch and handle any errors from 'catchAsyncError' func
app.use(globalErrorHandler);

export default app;
