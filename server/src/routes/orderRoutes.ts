import { Router } from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus,
  updatePaymentStatus
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Order Placement (Guest or Logged-in)
router.post('/', createOrder);

// Customer Orders
router.get('/myorders', protect, getMyOrders);

// Admin Order Management
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/payment-status', protect, adminOnly, updatePaymentStatus);

export default router;