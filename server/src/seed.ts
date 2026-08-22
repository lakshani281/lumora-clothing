import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    title: 'Classic Cotton Crew Neck',
    description: 'Premium everyday 100% cotton crew neck t-shirt with a relaxed fit.',
    price: 2800,
    category: 'men',
    fabric: '100% Cotton',
    stock: 25,
    images: ['/images/cat-men.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Navy'],
  },
  {
    title: "Women's Oversized Linen Tee",
    description: 'Breathable lightweight linen blend t-shirt designed for effortless daily style.',
    price: 3200,
    category: 'women',
    fabric: 'Linen',
    stock: 20,
    images: ['/images/cat-women.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige', 'Sage Green', 'White'],
  },
  {
    title: 'Kids Graphic Print Tee',
    description: 'Soft and durable cotton blend t-shirt featuring playful graphics for kids.',
    price: 2100,
    category: 'kids',
    fabric: 'Cotton Blend',
    stock: 30,
    images: ['/images/cat-kids.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Yellow', 'Blue', 'Red'],
  },
  {
    title: 'Performance Athletic Polo',
    description: 'Moisture-wicking performance fabric engineered for active lifestyles.',
    price: 4500,
    category: 'men',
    fabric: 'Performance',
    stock: 15,
    images: ['/images/cat-men.jpg'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal', 'White'],
  },
  {
    title: 'Custom Bulk Blank Cotton Tee',
    description: 'High-quality heavy cotton blank t-shirt optimized for custom screen printing.',
    price: 2500,
    category: 'custom',
    fabric: '100% Cotton',
    stock: 50,
    images: ['/images/cat-custom.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Grey Melange'],
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/lumora';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

    // පැරණි products ඉවත් කර අලුත් sample data එකතු කිරීම
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();