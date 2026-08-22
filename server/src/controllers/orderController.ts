import { Response } from 'express';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

// @desc    Create New Order (Guest or Logged-in)
// @route   POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customer, orderItems, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items provided' });
      return;
    }

    const orderData: any = {
      customer: customer || {
        name: shippingAddress?.name || 'Guest Customer',
        email: shippingAddress?.email || 'guest@lumora.lk',
      },
      orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod: paymentMethod || 'COD',
      status: 'Pending',
    };

    // User logged in නම් පමණක් user ID එක assign කරයි
    if (req.user?.id) {
      orderData.user = req.user.id;
    }

    const order = await Order.create(orderData);

    res.status(201).json({ success: true, message: 'Order placed successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get Logged-in User's Orders
// @route   GET /api/orders/myorders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get All Orders (Admin only)
// @route   GET /api/orders
export const getAllOrders = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update Order Status (Admin only)
// @route   PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json({ success: true, message: 'Order status updated', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};