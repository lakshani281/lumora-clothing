import React from 'react';

interface CategoriesSectionProps {
  setCurrentPage?: (page: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ setCurrentPage }) => {
  const categories = [
    { title: "Men's Collection", count: '24 Products', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=600' },
    { title: "Women's Collection", count: '18 Products', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
    { title: "Kids' Collection", count: '12 Products', image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Featured Categories</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentPage && setCurrentPage('products')}
            className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-stone-200"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-xl font-bold font-serif">{cat.title}</h3>
              <p className="text-xs text-stone-300 mt-1">{cat.count}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};