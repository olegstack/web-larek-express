import { Request, Response, NextFunction } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import { BadRequestError } from '../errors/bad-request-error';

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { total, items } = req.body;

    // Получаем товары по ID
    const products = await Product.find({ _id: { $in: items } });

    // Проверка: все ли ID найдены в базе
    if (products.length !== items.length) {
      return next(new BadRequestError('Некоторые товары не найдены'));
    }

    // Проверка: продается ли товар (т.е. цена не равна null)
    if (products.some((p) => p.price === null)) {
      return next(new BadRequestError('Некоторые товары не найдены'));
    }

    // Считаем общую сумму цен на все товары
    const calculatedTotal = products.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    );

    // Проверка: совпадает ли сумма заказа с указанной
    if (calculatedTotal !== total) {
      return next(new BadRequestError('Неверная сумма заказа'));
    }

    // Генерация ID заказа
    const orderId = faker.string.uuid();

    // Успешный ответ
    return res.status(200).json({
      id: orderId,
      total: calculatedTotal,
    });
  } catch (err) {
    return next(err);
  }
};

export default createOrder;
