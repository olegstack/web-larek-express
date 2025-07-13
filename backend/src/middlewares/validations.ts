import { celebrate, Joi, Segments } from 'celebrate';
import { RequestHandler } from 'express';

const validateOrder: RequestHandler = celebrate({
  [Segments.BODY]: Joi.object().keys({
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    total: Joi.number().required(),
    items: Joi.array().items(Joi.string().length(24)).min(1).required(), // валидация _id товара
  }),
});

export default validateOrder;
