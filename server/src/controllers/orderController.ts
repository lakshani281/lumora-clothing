import { Response } from 'express';
import { Resend } from 'resend';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

// Resend HTTP Client එක initialize කිරීම (Port blocks කිසිවක් බලනොපායි)
const resend = new Resend(process.env.RESEND_API_KEY);

// Email යැවීමේ Helper Function එක
const sendPaymentStatusEmail = async (order: any, status: string) => {
  const orderId = order._id ? order._id.toString().slice(-6).toUpperCase() : 'UNKNOWN';

  const recipientEmail =
    order.shippingAddress?.email ||
    order.customer?.email ||
    (order.user && typeof order.user === 'object' ? order.user.email : null);

  const customerName =
    order.shippingAddress?.name ||
    order.customer?.name ||
    (order.user && typeof order.user === 'object' ? order.user.name : null) ||
    'Valued Customer';

  if (!recipientEmail || recipientEmail === 'guest@lumora.lk') {
    console.log(`❌ [Order #${orderId}] Skipped: No valid external recipient email found.`);
    return;
  }

  let subject = '';
  let htmlContent = '';

  if (status === 'Verified') {
    subject = `Payment Verified - Order #${orderId} | Lumora Clothing`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1b5e3f;">Payment Confirmed!</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>We are pleased to inform you that your bank transfer for Order <strong>#${orderId}</strong> has been successfully verified.</p>
        <p><strong>Total Amount:</strong> Rs. ${order.totalAmount?.toLocaleString()}</p>
        <p>Your items are now being prepared for island-wide delivery. You will receive standard delivery within 3–5 business days.</p>
        <br/>
        <p>Thank you for choosing <strong>Lumora Clothing</strong>!</p>
      </div>
    `;
  } else if (status === 'Rejected') {
    subject = `Payment Issue - Order #${orderId} | Lumora Clothing`;
    htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #c53030;">Payment Verification Failed</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>We encountered an issue verifying the bank deposit slip uploaded for Order <strong>#${orderId}</strong>.</p>
        <p>Please contact our support team or reply to this email with a clear copy of your transfer receipt to proceed with fulfillment.</p>
        <p>WhatsApp / Call Support: <strong>+94 714262874</strong></p>
        <br/>
        <p>Regards,<br/>Lumora Clothing Team</p>
      </div>
    `;
  } else {
    return;
  }

  try {
    console.log(`[Order #${orderId}] Dispatching email via Resend API to: ${recipientEmail}...`);
    
    // Testing සඳහා onboarding@resend.dev භාවිතා කළ හැක (තමන්ගේම domain එකක් නැතිවිට)
    const { data, error } = await resend.emails.send({
      from: 'Lumora Clothing <onboarding@resend.dev>',
      to: recipientEmail,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error(`❌ [Order #${orderId}] Resend API Error:`, error);
    } else {
      console.log(`✓ [Order #${orderId}] Status email successfully delivered via Resend! (ID: ${data?.id})`);
    }
  } catch (err) {
    console.error(`❌ [Order #${orderId}] Failed to send status email:`, err);
  }
};

// @desc    Create New Order with Payment Slip (Guest or Logged-in)
// @route   POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { customer, orderItems, shippingAddress, totalAmount, paymentSlip } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items provided' });
      return;
    }

    if (!paymentSlip) {
      res.status(400).json({ message: 'Payment slip is required to place an order' });
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
      paymentMethod: 'Bank Transfer',
      paymentSlip,
      paymentStatus: 'Pending Verification',
      status: 'Pending',
    };

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

// @desc    Update Payment Status (Admin only: Verify or Reject slip)
// @route   PATCH /api/orders/:id/payment-status
export const updatePaymentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { paymentStatus } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    sendPaymentStatusEmail(order, paymentStatus);

    res.json({ success: true, message: 'Payment status updated', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};