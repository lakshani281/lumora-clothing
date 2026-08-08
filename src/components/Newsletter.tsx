import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Thank you for subscribing with ${email}!`);
      setEmail('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-[#134e35] text-white rounded-3xl p-10 md:p-16 text-center shadow-lg relative overflow-hidden">
        
        {/* Subtitle */}
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-3 block">
          STAY IN THE LOOP
        </span>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 tracking-wide">
          Stay Updated with New Collections
        </h2>

        {/* Description */}
        <p className="text-emerald-100/80 text-sm md:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Get early access to new arrivals, exclusive offers, and style inspiration delivered to your inbox.
        </p>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="w-full bg-emerald-900/40 border border-emerald-500/30 text-white placeholder-emerald-200/50 px-6 py-3.5 rounded-full text-sm focus:outline-none focus:border-amber-400 transition"
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-[#c99a4e] hover:bg-[#b8893d] text-gray-900 font-semibold px-8 py-3.5 rounded-full text-sm transition duration-300 shrink-0"
          >
            Subscribe
          </button>
        </form>

      </div>
    </section>
  );
};