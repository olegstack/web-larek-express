import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

export const validateOrder: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().length(24)).min(1).required(), // валидация _id товара
  }),
});

export const validateProduct: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    price: Joi.number().allow(null),
    description: Joi.string().optional(),
    image: Joi.object({
      fileName: Joi.string().required(),
      originalName: Joi.string().required(),
    }).required(),
  }),
});
