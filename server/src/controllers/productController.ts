import { Request, Response } from 'express';
import { Product } from '../models/Product.js';

// Get all products (with optional category filter)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;
    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new product (Admin)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price, category, images, sizes, colors, stock, isFeatured } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      stock,
      isFeatured,
    });

    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product (Admin)
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};