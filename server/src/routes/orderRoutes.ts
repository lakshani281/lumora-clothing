import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { 
  createOrder, 
  getMyOrders, 
  getAllOrders, 
  updateOrderStatus 
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// PayHere Official Sandbox Merchant Credentials
const MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID || '1211149';
// Official Sandbox Secret for Merchant 1211149
const MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET || '4T8nO6K3o2I8S8q9O4W7e2R1';

// PayHere Hash Generation Endpoint
router.post('/payhere-hash', (req: Request, res: Response) => {
  try {
    const { orderId, amount, currency = 'LKR' } = req.body;
    
    // Exact 2 decimal places formatted amount (e.g., 9600.00)
    const formattedAmount = Number(amount).toFixed(2);
    
    // Hash formula: strtoupper(md5(merchant_id + order_id + amount + currency + strtoupper(md5(merchant_secret))))
    const hashedSecret = crypto
      .createHash('md5')
      .update(MERCHANT_SECRET)
      .digest('hex')
      .toUpperCase();

    const mainString = `${MERCHANT_ID}${orderId}${formattedAmount}${currency}${hashedSecret}`;
    
    const hash = crypto
      .createHash('md5')
      .update(mainString)
      .digest('hex')
      .toUpperCase();

    res.json({
      merchant_id: MERCHANT_ID,
      hash: hash,
      amount: formattedAmount,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Hash generation failed', error: error.message });
  }
});

// Orders Endpoints
router.post('/', createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;