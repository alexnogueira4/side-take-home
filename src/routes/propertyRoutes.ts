import express from 'express';
import { paginationSchema, getByIdSchema, createSchema } from './schemas';
import { ValidationMiddleware } from '../helpers';
import {
  findAllHandler,
  getByIdHandler,
  createHandler,
  deleteHandler,
  updateHandler
} from '../controllers/Property';

export const propertyRoutes = express.Router();

propertyRoutes.get('/', ValidationMiddleware({ query: paginationSchema }), findAllHandler);
propertyRoutes.get('/:id', ValidationMiddleware({ params: getByIdSchema }), getByIdHandler);
propertyRoutes.post('/', ValidationMiddleware({ body: createSchema }), createHandler);
propertyRoutes.delete('/:id', ValidationMiddleware({ params: getByIdSchema }), deleteHandler);
propertyRoutes.put(
  '/:id',
  ValidationMiddleware({ params: getByIdSchema, body: createSchema }),
  updateHandler
);
