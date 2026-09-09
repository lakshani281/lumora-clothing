import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 5000;

// CORS - සියලුම origins සහ methods වලට ඉඩ දීම
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Base Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Lumora Backend API is running smoothly!' });
});

// Database Connection & Server Start (0.0.0.0 bind for cloud deployment)
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port: ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to Database:', err);
});