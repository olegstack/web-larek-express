import mongoose, { Schema, Document, Model } from 'mongoose';

// Интерфейс для продукта
export interface IProduct extends Document {
  description?: string;
  image: {
    fileName: string;
    originalName: string;
  };
  title: string;
  category: string;
  price: number | null;
}

// Схема продукта
const productSchema: Schema<IProduct> = new mongoose.Schema({
  description: {
    type: String,
  },
  image: {
    type: {
      fileName: { type: String, required: true },
      originalName: { type: String, required: true },
    },
    required: true,
  },
  title: {
    type: String,
    unique: true,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: null,
  },
});

// Экспорт модели
const Product: Model<IProduct> = mongoose.model<IProduct>(
  'product',
  productSchema,
);
export default Product;
