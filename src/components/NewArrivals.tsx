import React from 'react';

interface NewArrivalsProps {
  setCurrentPage?: (page: string) => void;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-1">
            FRESH DESIGNS
          </span>
          <h2 className="text-3xl font-serif font-bold text-stone-900">New Arrivals</h2>
        </div>
        
        <button
          onClick={() => setCurrentPage && setCurrentPage('products')}
          className="text-emerald-800 font-semibold text-sm hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <span>View All</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
};