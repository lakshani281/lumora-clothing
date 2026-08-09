import type { Product } from '../types';

export const allProductsData: Product[] = [
  {
    id: '1',
    name: 'Classic White Essential',
    category: 'men',
    rating: 5,
    reviewsCount: 124,
    price: 2200,
    priceFormatted: 'Rs. 2,200',
    imageUrl: '/images/prod-1.jpg',
    colors: ['#ffffff', '#064e3b'],
    fabric: '100% Cotton',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '2',
    name: 'Urban Comfort Tee',
    category: 'men',
    rating: 5,
    reviewsCount: 89,
    price: 2600,
    priceFormatted: 'Rs. 2,600',
    imageUrl: '/images/prod-2.jpg',
    colors: ['#111827', '#1e293b'],
    fabric: 'Cotton Blend',
    sizes: ['M', 'L', 'XL']
  },
  {
    id: '3',
    name: 'Weekend Relaxed Fit',
    category: 'men',
    rating: 5,
    reviewsCount: 67,
    price: 2400,
    priceFormatted: 'Rs. 2,400',
    imageUrl: '/images/prod-3.jpg',
    colors: ['#d97706', '#000000'],
    fabric: '100% Cotton',
    sizes: ['S', 'M', 'L']
  },
  {
    id: '4',
    name: 'Signature Premium Tee',
    category: 'women',
    rating: 5,
    reviewsCount: 43,
    price: 3200,
    priceFormatted: 'Rs. 3,200',
    imageUrl: '/images/prod-4.jpg',
    colors: ['#047857', '#ffffff'],
    fabric: 'Linen',
    sizes: ['XS', 'S', 'M']
  },
  {
    id: '5',
    name: 'Everyday Classic',
    category: 'men',
    rating: 5,
    reviewsCount: 50,
    price: 1800,
    priceFormatted: 'Rs. 1,800',
    imageUrl: '/images/prod-1.jpg',
    colors: ['#ffffff'],
    fabric: '100% Cotton',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: '6',
    name: 'Comfort Crew Neck',
    category: 'men',
    rating: 5,
    reviewsCount: 62,
    price: 2100,
    priceFormatted: 'Rs. 2,100',
    imageUrl: '/images/prod-2.jpg',
    colors: ['#ffffff', '#111827'],
    fabric: 'Cotton Blend',
    sizes: ['M', 'L']
  },
  {
    id: '7',
    name: 'Minimal Pocket Tee',
    category: 'women',
    rating: 5,
    reviewsCount: 74,
    price: 1950,
    priceFormatted: 'Rs. 1,950',
    imageUrl: '/images/prod-4.jpg',
    colors: ['#ffffff'],
    fabric: '100% Cotton',
    sizes: ['XS', 'S', 'M']
  },
  {
    id: '8',
    name: 'Heritage Wash Tee',
    category: 'men',
    rating: 5,
    reviewsCount: 86,
    price: 2300,
    priceFormatted: 'Rs. 2,300',
    imageUrl: '/images/prod-3.jpg',
    colors: ['#ffffff'],
    fabric: 'Cotton Blend',
    sizes: ['S', 'M', 'L']
  },
  {
    id: '9',
    name: 'Sports Performance',
    category: 'custom',
    rating: 5,
    reviewsCount: 98,
    price: 2800,
    priceFormatted: 'Rs. 2,800',
    imageUrl: '/images/cat-custom.jpg',
    colors: ['#000000', '#ef4444'],
    fabric: 'Performance',
    sizes: ['M', 'L', 'XL', 'XXL']
  }
];

export const newArrivalsData = allProductsData.slice(0, 4);