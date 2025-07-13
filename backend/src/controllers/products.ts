import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';

// Получение всех продуктов
export const getProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({});
    return res.send({ items: products, total: products.length });
  } catch (err) {
    return next(err);
  }
};

// Создание продукта
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).send(product);
  } catch (err) {
    if (err instanceof MongooseError.ValidationError) {
      return next(
        new BadRequestError('Ошибка валидации данных при создании товара'),
      );
    }

    if (err instanceof Error && err.message.includes('E11000')) {
      return next(new ConflictError('Товар с таким названием уже существует'));
    }

    return next(err);
  }
};
