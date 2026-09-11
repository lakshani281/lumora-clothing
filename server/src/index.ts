import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = Number(process.env.PORT) || 8080;

// CORS - PATCH method එකද ඇතුළත්ව සියලුම preflight requests සඳහා අවසර දීම
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Railway root ping සහ browser direct check සඳහා
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Lumora Backend API is live!' });
});

// Base Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Lumora Backend API is running smoothly!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Server start කර පළමුව Port එකට bind වීම (Railway health check pass වීමට)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ Server running on port: ${PORT}`);
  
  // Port එක listen වූ පසු Database connect කිරීම
  connectDB()
    .then(() => {
      console.log('✓ MongoDB connection established successfully');
    })
    .catch((err) => {
      console.error('Failed to connect to Database:', err);
    });
});