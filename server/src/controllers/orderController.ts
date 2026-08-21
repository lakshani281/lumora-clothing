import { Response } from 'express';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

// Create New Order
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { orderItems, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items provided' });
      return;
    }

    const order = await Order.create({
      user: req.user?.id as string,
      orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Logged-in User's Orders
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Orders (Admin only)
export const getAllOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};