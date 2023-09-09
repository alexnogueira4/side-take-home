import express, { Request, Response, RequestHandler } from 'express';
import { PropertyService } from '../services';
import { API_ERROR } from '../helpers';

export const propertyRoutes = express.Router();

export const findAllHandler: RequestHandler = async (req: Request<{}, {}, {}>, res: Response) => {
  const response = await new PropertyService().findAll(req.query);
  res.send(response);
};

export interface PathParams {
  id: number;
}

export const getByIdHandler: RequestHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const property = await new PropertyService().getById(id);

  if (!property) {
    throw new API_ERROR('Property not found', 'NOT_FOUND');
  }

  res.send(property);
};

export const createHandler: RequestHandler = async (req: Request, res: Response) => {
  const payload = req.body;
  const response = await new PropertyService().create(payload);
  res.send(response);
};

export const updateHandler: RequestHandler = async (req: Request, res: Response) => {
  const payload = req.body;
  const id = parseInt(req.params.id);
  const response = await new PropertyService().update(payload, id);
  if (!response) {
    throw new API_ERROR('Property not found', 'NOT_FOUND');
  }
  res.send(response);
};

export const deleteHandler: RequestHandler = async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const response = await new PropertyService().delete(id);
  if (!response) {
    throw new API_ERROR('Property not found', 'NOT_FOUND');
  }

  res.send(response);
};