import { Router } from 'express';
import createOrder from '../controllers/order';
import validateOrder from '../middlewares/validations';

const router = Router();

router.post('/order', validateOrder, createOrder);

export default router;
