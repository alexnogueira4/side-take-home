import Joi from 'joi';

export const paginationSchema = Joi.object({
  page: Joi.number().integer().optional(),
  limit: Joi.number().integer().optional(),
  minPrice: Joi.number().optional().default(0),
  maxPrice: Joi.number().optional().default(Number.MAX_VALUE).min(Joi.ref('minPrice')),
  bedrooms: Joi.number().optional(),
  bathrooms: Joi.number().optional(),
  type: Joi.string().optional(),
  orderBy: Joi.string().optional(),
  order: Joi.string().valid('ASC','DESC').insensitive().optional(),
  search: Joi.string().optional()
});

export const getByIdSchema = Joi.object({
  id: Joi.number().integer()
})

export const createSchema = Joi.object({
  address: Joi.string().required(),
  price: Joi.number().required(),
  bedrooms: Joi.number().required(),
  bathrooms: Joi.number().required(),
  type: Joi.string().optional().allow(null)
});