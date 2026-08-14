import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { newArrivalsData } from '../data/products';

// 1. TypeScript Props Interface එක අර්ථ දැක්වීම (TypeScript Error එක විසඳීමට)
interface NewArrivalsProps {
  setCurrentPage?: (page: string) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ setCurrentPage }) => {
  // Click කළ Product එකේ ID එක තබා ගැනීමට State එකක්
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const handleCardClick = (id: string) => {
    setActiveProductId(activeProductId === id ? null : id);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
          New Arrivals
        </h2>
        
        {/* 2. View All Button එක Products Page එකට Route වන පරිදි සැකසීම */}
        <button 
          onClick={() => setCurrentPage && setCurrentPage('products')} 
          className="text-emerald-800 hover:text-emerald-900 font-medium text-sm underline underline-offset-4 decoration-emerald-800 cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivalsData.map((product) => {
          const isActive = activeProductId === product.id;

          return (
            <div 
              key={product.id} 
              onClick={() => handleCardClick(product.id)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-100 flex flex-col justify-between group cursor-pointer"
            >
              
              {/* Image Container with Buttons Overlay */}
              <div className="relative h-80 overflow-hidden bg-gray-100">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Dark Overlay gradient when active/hover */}
                <div 
                  className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} 
                />

                {/* Buttons Container */}
                <div 
                  className={`absolute inset-x-0 bottom-6 px-6 flex flex-col gap-3 transition-all duration-300 transform ${
                    isActive 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                  }`}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`${product.name} added to cart!`);
                    }}
                    className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium py-3 rounded-full text-sm transition duration-200 shadow-md cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Quick View: ${product.name}`);
                    }}
                    className="w-full bg-white/90 hover:bg-white text-gray-900 font-medium py-3 rounded-full text-sm backdrop-blur-xs transition duration-200 shadow-md cursor-pointer"
                  >
                    Quick View
                  </button>
                </div>

              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">
                    {product.name}
                  </h3>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs text-gray-500 ml-1 font-light">
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>

                {/* Price & Colors */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-emerald-800 font-semibold text-base">
                    {product.price}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {product.colors.map((color, index) => (
                      <span 
                        key={index} 
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-xs inline-block"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};