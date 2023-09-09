import { ErrorRequestHandler, Request, Response } from 'express';
import { API_ERROR_NAME, ERRORS } from './constants';
import createError from 'http-errors';

export const NotFoundHandler = (req: Request, res: Response) => {
  res.status(404).send(createError(404));
}
export const ErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error.name === API_ERROR_NAME) {
    return res
      .status(error.statusCode)
      .json({ error: error.errorName, message: error.message });
  }

  const serverError = ERRORS.INTERNAL_SERVER_ERROR;

  res.status(serverError.statusCode)
    .json({
      error: serverError.errorName,
      message: error.message || 'Unexpected error'
    });
};

export class API_ERROR extends Error {
  errorName: string;
  statusCode: number;

  constructor(message: string, code: keyof typeof ERRORS) {
    super(message);

    const { errorName, statusCode } = ERRORS[code];

    this.errorName = errorName;
    this.statusCode = statusCode;
    this.name = API_ERROR_NAME;
  }
}