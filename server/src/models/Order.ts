import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  product?: Types.ObjectId | string;
  title: string;
  quantity: number;
  price: number;
  size: string;
  color?: string;
  image: string;
}

export interface IOrder extends Document {
  user?: Types.ObjectId | string;
  customer: {
    name: string;
    email: string;
  };
  orderItems: IOrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  totalAmount: number;
  paymentMethod: 'Bank Transfer';
  paymentSlip: string; // Receipt / Slip image (Base64 or URL)
  paymentStatus: 'Pending Verification' | 'Verified' | 'Rejected';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema: Schema<IOrder> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      index: true, // User ID එකෙන් orders සෙවීම වේගවත් කිරීමට
    },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true, index: true }, // Email query සඳහා index එකක්
    },
    orderItems: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: false,
        },
        title: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        size: { type: String, required: true },
        color: { type: String, default: 'Standard' },
        image: { type: String, required: true },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      default: 'Bank Transfer',
    },
    paymentSlip: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending Verification', 'Verified', 'Rejected'],
      default: 'Pending Verification',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index එකක්: User ID සහ Email මඟින් sort කිරීම පහසු කිරීමට
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'customer.email': 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);