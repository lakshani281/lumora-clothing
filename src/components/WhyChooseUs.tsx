import React, { useState } from 'react';
import { promisesData } from '../data/promises';

export const WhyChooseUs: React.FC = () => {
  // Default ලෙස දෙවැනි Card එක Active කර තබා ගනී (Screenshot එකේ ඇති පරිදි)
  const [activeCardId, setActiveCardId] = useState<string>('2');

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold">
          OUR PROMISE
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
          Why Choose Lumora
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {promisesData.map((item) => {
          const isActive = activeCardId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setActiveCardId(item.id)}
              className={`bg-white rounded-2xl p-8 cursor-pointer transition-all duration-300 flex flex-col justify-between border ${
                isActive
                  ? 'border-transparent shadow-xl ring-2 ring-emerald-800/10 scale-[1.02]'
                  : 'border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="text-3xl mb-6">{item.icon}</div>
                <h3 className="font-serif font-bold text-lg text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};