import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import config from './config';
import productRoutes from './routes/product';
import orderRoutes from './routes/order';
import { errorLogger, requestLogger } from './middlewares/logger';
import errorHandler from './middlewares/error-handler';

const { PORT, DB_ADDRESS } = config;
const app = express();

// Подключение логгера запросов
app.use(requestLogger);

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

// Логгер ошибок
app.use(errorLogger);

// Централизованный обработчик ошибок
app.use(errorHandler);

// Fallback для SPA
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  const now = new Date();
  console.log(
    `Server started at ${now.toLocaleString()}. Listening on port ${PORT}`,
  );
});
