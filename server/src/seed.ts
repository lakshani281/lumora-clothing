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
    title: 'Custom Tiger Graphic Tee',
    description: 'Vibrant neon illustrated graphic tee optimized for custom printing.',
    price: 4500,
    category: 'custom',
    fabric: 'Performance',
    stock: 50,
    images: ['/images/cat-custom.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black'],
  },
  {
    title: 'Men Heavyweight White Tee',
    description: 'Clean aesthetic heavyweight premium crewneck daily t-shirt.',
    price: 3200,
    category: 'men',
    fabric: '100% Cotton',
    stock: 18,
    images: ['/images/prod-1.jpg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['White'],
  },
  {
    title: 'Kids Casual Street Tee',
    description: 'Comfortable everyday casual t-shirt for kids.',
    price: 2400,
    category: 'kids',
    fabric: 'Cotton Blend',
    stock: 22,
    images: ['/images/prod-2.jpg'],
    sizes: ['XS', 'S', 'M'],
    colors: ['White', 'Cream'],
  },
  {
    title: 'Earth Tone Streetwear Tee',
    description: 'Relaxed urban fit graphic tee designed with premium linen-cotton fabric.',
    price: 3600,
    category: 'men',
    fabric: 'Linen',
    stock: 15,
    images: ['/images/prod-3.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Brown'],
  },
  {
    title: "Women's Neutral Fit Daily Tee",
    description: 'Versatile chic minimal aesthetic daily top for women.',
    price: 3500,
    category: 'women',
    fabric: '100% Cotton',
    stock: 25,
    images: ['/images/prod-4.jpg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Beige', 'Off-White'],
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/lumora';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding...');

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