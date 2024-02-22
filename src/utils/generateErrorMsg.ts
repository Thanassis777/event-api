import { StatusTypes } from '../constants/statusCodes';

interface NewError {
  message: string;
  status: string;
  isOperational: boolean;
  statusCode: number;
}

const generateErrorMsg = (message: string, statusCode: number) => {
  const error: NewError = Object.create(Error.prototype);

  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith('4') ? StatusTypes.FAIL : StatusTypes.ERROR;
  error.isOperational = true;
  error.message = message;

  Error.captureStackTrace(error, generateErrorMsg);

  return error;
};

export default generateErrorMsg;
