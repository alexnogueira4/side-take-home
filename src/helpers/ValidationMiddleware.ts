import { Request, Response, NextFunction } from 'express';
import { API_ERROR } from './ErrorHandlers';

export const ValidationMiddleware = (schema: any) => {
  return (req: Request | any, res: Response, next: NextFunction) => {
    let isInvalid: boolean = false;
    let message: string = '';
    Object.keys(schema).forEach((currentKey: any) => {
      const { error } = schema[currentKey].validate(req[currentKey], { abortEarly: false });

      isInvalid = isInvalid || !!error;

      if (error) {
        const { details } = error;
        message = details.map((i: any) => i.message).join(', ');
      }
    });

    if (!isInvalid) {
      next();
    } else {
      throw new API_ERROR(message, 'VALIDATION_ERROR')
    }
  }
};