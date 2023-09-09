export const API_ERROR_NAME = 'API_ERROR';

export const ERRORS = {
  INTERNAL_SERVER_ERROR: {
    errorName: 'INTERNAL SERVER ERROR',
    statusCode: 500,
  },
  NOT_FOUND: {
    errorName: 'NOT FOUND',
    statusCode: 404,
  },
  VALIDATION_ERROR: {
    errorName: 'Validation Error',
    statusCode: 400,
  },
  BAD_REQUEST: {
    errorName: 'BAD REQUEST',
    statusCode: 400,
  },
  UNAUTHORIZED: {
    errorName: 'UNAUTHORIZED',
    statusCode: 401,
  },
  FORBIDDEN: {
    errorName: 'FORBIDDEN',
    statusCode: 403,
  },
};