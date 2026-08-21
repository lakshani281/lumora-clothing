import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Base Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Lumora Backend API is running smoothly!' });
});

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on: http://localhost:${PORT}`);
  });
});