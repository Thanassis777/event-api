import { NextFunction, Request, Response } from 'express';

/* Middleware to help in avoiding repetitive error-handling code
 * for each individual asynchronous route handler
 * */
export const catchAsyncError = (fn) => (req: Request, res: Response, next: NextFunction) =>
  fn(req, res, next).catch(next); // Errors are handled through 'globalErrorHandler' through next middleware in errorController
