import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public Routes (ඕනෑම කෙනෙකුට බැලිය හැක)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin Routes (ඇඳුම් add/delete කිරීම)
router.post('/', protect, adminOnly, createProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;