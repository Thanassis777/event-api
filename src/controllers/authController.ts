import { NextFunction, Request, RequestHandler, Response } from 'express';
import * as process from 'process';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import User, { IUserSchema } from '../models/userModel';
import { catchAsyncError } from '../middlewares/catchAsyncError';
import { StatusCodes, StatusTypes } from '../constants/statusCodes';
import EmailConstants from '../constants/emailConstants';
import generateErrorMsg from '../utils/generateErrorMsg';
import sendEmailFunc from '../utils/email';
import { replacePlaceholderWithHTML } from '../helpers/email.helper';

// Check whether the token is destined for password reset or authentication
const signToken = (id: string, isPasswordReset = false) =>
  !isPasswordReset
    ? jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRES_IN })
    : jwt.sign({ 'email': id }, process.env.JWT_SECRET_PASSWORD_RESET, {
        expiresIn: process.env.JWT_SECRET_PASSWORD_RESET_EXPIRES_IN,
      });

const createSendToken = (user: IUserSchema, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: StatusTypes.SUCCESS,
    token,
    data: user,
  });
};

export const registerUser: RequestHandler = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, StatusCodes.CREATED, res);
});

export const loginUser = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) return next(generateErrorMsg('Please provide email or password', StatusCodes.BAD_REQUEST));

  // enforce to select password, as it is set { select:false } in our user schema
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(generateErrorMsg('Incorrect credentials', StatusCodes.UNAUTHORIZED));

  createSendToken(user, StatusCodes.OK, res);
});

export const updatePassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { passwordConfirm, password } = req.body;
  const { userId } = res.locals.user;

  // Start of Validations
  if (!passwordConfirm || !password)
    return next(generateErrorMsg('Please provide necessary inputs', StatusCodes.BAD_REQUEST));

  const user = await User.findById(userId).select('+password');

  if (!user || !(await user.correctPassword(passwordConfirm, user.password)))
    return next(generateErrorMsg('Incorrect old Password', StatusCodes.UNAUTHORIZED));

  if (passwordConfirm == password)
    return next(generateErrorMsg('Old and New Password should be different', StatusCodes.UNAUTHORIZED));
  // End of Validations
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);

  const doc = await User.findByIdAndUpdate(
    userId,
    { password: newPassword },
    { new: true, runValidators: true, }
  );

  res.status(StatusCodes.OK).json({
    status: StatusTypes.SUCCESS,
    data: doc,
  });
});

export const forgotPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {  
  const { user } = res.locals;
  const { email } = user;

  // generate and store a JWT token to initiate the reset password process
  const resetPasswordToken = signToken(email, true);
  await user.updateOne({ resetPasswordToken });

  // notify then user with the reset password instructions
  const emailBody = replacePlaceholderWithHTML(EmailConstants.RESET_PASSWORD_BODY_TEMPLATE, {
    recipient: user.firstName,
    token: resetPasswordToken,
    reset_link: process.env.EMAIL_PASSWORD_RESET_LINK,
    expires_in: process.env.JWT_SECRET_PASSWORD_RESET_EXPIRES_IN,
  });
  
  // sent the actual message to client email
  sendEmailFunc(email, EmailConstants.RESET_PASSWORD_SUBJECT, emailBody);
  
  res.status(StatusCodes.OK).json({
    status: StatusTypes.SUCCESS,
    data: 'Message was sent successfully.',
  });
});

export const resetPassword = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword: newPasswordPlain } = req.body;  
  if (!newPasswordPlain) 
    return next(generateErrorMsg('New password was not provided', StatusCodes.BAD_REQUEST));

  const { user } = res.locals;

  // hash the plain text provided password
  const salt = await bcrypt.genSalt(10);
  const newPasswordHashed = await bcrypt.hash(newPasswordPlain, salt);
  
  // store new password in DB and remove the existing reset token
  const doc = await User.findByIdAndUpdate(
    user.id,
    { password: newPasswordHashed, resetPasswordToken: '' },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({
    status: StatusTypes.SUCCESS,
    data: doc,
  });
});
