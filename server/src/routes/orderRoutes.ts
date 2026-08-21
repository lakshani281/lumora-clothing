import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);

export default router;