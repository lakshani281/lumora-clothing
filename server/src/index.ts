import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base Route Test
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Lumora Backend API is running smoothly!' });
});

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on: http://localhost:${PORT}`);
  });
});