import { Response } from 'express';
import nodemailer from 'nodemailer';
import { Order } from '../models/Order.js';
import { AuthRequest } from '../middleware/auth.js';

// Railway timeout වැළැක්වීමට Port 465 (Direct SSL) සහ socket timeouts යෙදීම
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Port 465 සඳහා true විය යුතුය
  auth: {
    user: process.env.EMAIL_USER || 'lumoraclothing15@gmail.com',
    pass: process.env.EMAIL_PASS, // Gmail App Password එක
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
});

// Email යැවීමේ Helper Function එක
const sendPaymentStatusEmail = async (order: any, status: string) => {
  const orderId = order._id ? order._id.toString().slice(-6).toUpperCase() : 'UNKNOWN';

  // Email එක ලබාගත හැකි සියලුම තැන් පරීක්ෂා කිරීම
  let recipientEmail =
    order.shippingAddress?.email ||
    order.customer?.email ||
    (order.user && typeof order.user === 'object' ? order.user.email : null);

  const customerName =
    order.shippingAddress?.name ||
    order.customer?.name ||
    (order.user && typeof order.user === 'object' ? order.user.name : null) ||
    'Valued Customer';

  console.log(`[Order #${orderId}] Checking recipient details:`, {
    customerEmail: order.customer?.email,
    shippingEmail: order.shippingAddress?.email,
    userEmail: order.user && typeof order.user === 'object' ? order.user.email : null,
    resolvedRecipient: recipientEmail,
  });

  // සැබෑ email එකක් නැත්නම් log එකක් දමා නතර කිරීම
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
    console.log(`[Order #${orderId}] Attempting to dispatch email to: ${recipientEmail}...`);
    const info = await transporter.sendMail({
      from: `"Lumora Clothing" <${process.env.EMAIL_USER || 'lumoraclothing15@gmail.com'}>`,
      to: recipientEmail,
      subject,
      html: htmlContent,
    });
    console.log(`✓ [Order #${orderId}] Status email sent successfully to: ${recipientEmail} (Msg ID: ${info.messageId})`);
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
    const { paymentStatus } = req.body; // 'Verified' | 'Rejected' | 'Pending Verification'
    
    // User විස්තරද සහිතව order එක update කිරීම
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Email එක background එකෙන් යැවීම
    sendPaymentStatusEmail(order, paymentStatus);

    res.json({ success: true, message: 'Payment status updated', order });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};