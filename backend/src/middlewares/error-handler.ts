import { isCelebrateError } from 'celebrate';
import { Error as MongooseError } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { ConflictError } from '../errors/conflict-error';
import { NotFoundError } from '../errors/not-found-error';

const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isCelebrateError(err)) {
    return res.status(400).json({
      message: 'Ошибка валидации данных',
    });
  }

  // Ошибка валидации Mongoose
  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ message: 'Ошибка валидации данных' });
  }

  // Ошибка неверного ID
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ message: 'Некорректный ID' });
  }

  // Кастомные ошибки
  if (
    err instanceof BadRequestError
    || err instanceof NotFoundError
    || err instanceof ConflictError
  ) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Необработанная ошибка
  const statusCode = (err as any).statusCode || 500;
  const message = statusCode === 500
    ? 'На сервере произошла ошибка'
    : (err as any).message;
  return res.status(statusCode).json({ message });
};

export default errorHandler;
