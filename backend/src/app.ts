import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import { rateLimit } from 'express-rate-limit';
import { NotFoundError } from './errors/not-found-error';
import config from './config';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';

const { PORT, DB_ADDRESS } = config;
const app = express();

// Лимитер запросов — защита от DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP за 15 минут
  message: 'Слишком много запросов с этого IP, попробуйте позже.',
});

// Подключение логгера запросов
app.use(requestLogger);

app.use(limiter);

// Разрешаем CORS
app.use(cors());

// Парсим входящие данные
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Раздача статических файлов до роутов API
app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных MongoDB
mongoose.connect(DB_ADDRESS);

// Роуты
app.use('/', productRoutes);
app.use('/', orderRoutes);

app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
}); // обязательно подключать до логера ошибок, иначе переход не будет записан в логи

// Логгер ошибок
app.use(errorLogger);

// Централизованный обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  const now = new Date();
  console.log(
    `Server started at ${now.toLocaleString()}. Listening on port ${PORT}`,
  );
});
