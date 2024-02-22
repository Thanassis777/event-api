import { Request, Response, NextFunction } from 'express';
import generateErrorMsg from '../utils/generateErrorMsg';
import { StatusCodes, StatusTypes } from '../constants/statusCodes';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return generateErrorMsg(message, StatusCodes.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return generateErrorMsg(message, StatusCodes.BAD_REQUEST);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return generateErrorMsg(message, StatusCodes.BAD_REQUEST);
};

const handleJWTError = () => generateErrorMsg('Invalid token. Please log in again!', StatusCodes.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  generateErrorMsg('Your token has expired! Please log in again.', StatusCodes.UNAUTHORIZED);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  err.isOperational
    ? res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    : // Programming or other unknown error: don't leak error details
      // Send generic message
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusTypes.ERROR,
        message: 'Something went very wrong!',
      });
};

/* Error handling middleware function helps to centralize the handling of errors that occur during the processing of requests.
 * This middleware is intended to be used at the end of middleware chain, after all your route handlers.
 * */
export const globalErrorHandler = (err, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || StatusTypes.ERROR;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    else if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    else if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    else if (err.name === 'JsonWebTokenError') err = handleJWTError();
    else if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendErrorProd(err, res);
  }
};
