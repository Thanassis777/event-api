import * as process from 'process';
import { NextFunction, Response, Request } from 'express';
import { Document } from 'mongoose';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { catchAsyncError } from './catchAsyncError';
import { StatusCodes } from '../constants/statusCodes';
import generateErrorMsg from '../utils/generateErrorMsg';
import User from '../models/userModel';
import { authApi } from '../constants/routeUrls';

interface UserRequest extends Request {
  user: Document;
}

export const authorizeUser = catchAsyncError(async (req: UserRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) 
    return next(generateErrorMsg('You are either not logged in or unauthorized to proceed.', StatusCodes.UNAUTHORIZED));

  // in case of password reset request, use the respective jwt secret
  const isPasswordReset = authApi.RESET_PASSWORD_URL === req.path;
  const JWTSecret = isPasswordReset ? process.env.JWT_SECRET_PASSWORD_RESET : process.env.JWT_SECRET;

  // expected signed identifier field in the token depends on the incoming request
  jwt.verify(token, JWTSecret, async (err: VerifyErrors, decoded: JwtPayload) => {
    if (err) return next(generateErrorMsg('Invalid signature!', StatusCodes.UNAUTHORIZED));
    
    let currentUser = undefined;
    if (decoded.id) currentUser = await User.findById(decoded.id);
    else if (decoded.email) currentUser = await User.findOne({ email: decoded.email });
    else return next(generateErrorMsg('Expected identifier field was not found in the token.', StatusCodes.BAD_REQUEST));
    if (!currentUser) 
      return next(generateErrorMsg('The user belonging to this token does no longer exist.', StatusCodes.UNAUTHORIZED));
    
    /* password reset token provided in req, since valid, should also be the same 
      with the one persisted in DB for the respected user */
    if (isPasswordReset && currentUser.resetPasswordToken !== token) 
      generateErrorMsg('Token provided is not valid.', StatusCodes.UNAUTHORIZED);
          
    // send data from middleware to catch up function
    res.locals.user = currentUser;
    next();
  });
});
