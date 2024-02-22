import { NextFunction, Response, Request } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

import { catchAsyncError } from './catchAsyncError';
import generateErrorMsg from '../utils/generateErrorMsg';
import User from '../models/userModel';
import { StatusCodes, StatusTypes } from '../constants/statusCodes';

export const validateForgotPasswordReq = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  if (!email) return next(generateErrorMsg('Email was not provided.', StatusCodes.BAD_REQUEST));

  let currentUser = await User.findOne({ email });
  if (!currentUser) return next(generateErrorMsg('Incorrect email was provided.', StatusCodes.BAD_REQUEST));

  res.locals.user = currentUser;
  const { resetPasswordToken: token } = currentUser;

  // if no existing token is found, user can continue the forgot password request
  if (!currentUser.resetPasswordToken) return next();

  /* if valid reset token already exists for user, return it and interrupt the current 
    forgot password req. if invalid token exists erase it and continue process */
  jwt.verify(token, process.env.JWT_SECRET_PASSWORD_RESET, async (err: VerifyErrors, decoded: JwtPayload) => {
    if (decoded)
      return res.status(StatusCodes.CONFLICT).json({
        status: StatusTypes.INFO,
        token,
        data: currentUser,
      });

    currentUser = await currentUser.updateOne({ resetPasswordToken: '' });
    res.locals.user.resetPasswordToken = '';
    next();
  });
});
