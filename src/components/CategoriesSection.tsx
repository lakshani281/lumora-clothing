import React from 'react';
import { categoriesData } from '../data/categories';

export const CategoriesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">SHOP BY</span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
          Featured Categories
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoriesData.map((category) => (
          <div key={category.id} className="relative group rounded-2xl overflow-hidden h-[420px] shadow-md cursor-pointer">
            <img src={category.imageUrl} alt={category.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-serif font-semibold">{category.title}</h3>
              <p className="text-xs text-gray-300 mt-1 font-light">{category.stylesCount}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};