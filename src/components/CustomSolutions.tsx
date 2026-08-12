import React from 'react';

interface CustomSolutionsProps {
  setCurrentPage?: (page: string) => void;
}

export const CustomSolutions: React.FC<CustomSolutionsProps> = ({ setCurrentPage }) => {
  return (
    <section className="py-16 px-6 bg-stone-100">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold text-stone-900">Custom Bulk Orders</h2>
        <p className="text-stone-600 max-w-2xl mx-auto text-sm">
          Looking for custom-designed apparel for your business or event? Get premium quality t-shirts with flexible bulk options.
        </p>
        
        <button
          onClick={() => setCurrentPage && setCurrentPage('bulk-orders')}
          className="bg-[#1b5e3f] hover:bg-[#14472f] text-white px-8 py-3.5 rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-xs"
        >
          Start Bulk Orders →
        </button>
      </div>
    </section>
  );
};