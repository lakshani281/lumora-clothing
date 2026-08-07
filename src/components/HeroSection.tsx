import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div 
      className="relative min-h-screen flex flex-col justify-between bg-cover bg-center text-white"
      style={{ backgroundImage: `linear-gradient(rgba(10, 20, 15, 0.75), rgba(10, 20, 15, 0.75)), url('/images/hero-bg.jpg')` }}
    >
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold tracking-widest flex items-center">
          <span>Lumora</span>
          <span className="text-xs font-light tracking-normal ml-2 text-gray-300">CLOTHING</span>
        </div>

        <div className="hidden md:flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <a href="#" className="bg-emerald-900/60 text-emerald-400 px-5 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30">Home</a>
          <a href="#" className="text-gray-200 hover:text-white px-4 py-1.5 text-sm font-medium transition">Products</a>
          <a href="#" className="text-gray-200 hover:text-white px-4 py-1.5 text-sm font-medium transition">Bulk Orders</a>
          <a href="#" className="text-gray-200 hover:text-white px-4 py-1.5 text-sm font-medium transition">About Us</a>
          <a href="#" className="text-gray-200 hover:text-white px-4 py-1.5 text-sm font-medium transition">Contact</a>
        </div>

        <div className="flex items-center space-x-5 text-gray-200">
          <button className="hover:text-white transition"><Search size={20} /></button>
          <button className="hover:text-white transition"><Heart size={20} /></button>
          <button className="hover:text-white transition"><ShoppingBag size={20} /></button>
          <button className="hover:text-white transition"><User size={20} /></button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto text-center px-4 py-20 my-auto">
        <div className="inline-block border border-amber-500/50 bg-amber-900/10 px-5 py-1.5 rounded-full text-amber-400 text-xs tracking-widest font-semibold uppercase mb-8">
          PREMIUM SRI LANKAN APPAREL
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-semibold leading-tight tracking-wide mb-6">
          Wear Confidence.<br />
          <span className="italic font-normal">Wear Lumora.</span>
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Premium T-shirts crafted with comfort, quality, and modern style for every occasion.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white font-medium px-8 py-3.5 rounded-full transition duration-300">
            Shop Collection
          </button>
          <button className="w-full sm:w-auto border border-gray-400 hover:border-white text-white font-medium px-8 py-3.5 rounded-full transition duration-300">
            Bulk Orders
          </button>
        </div>
      </main>

      <div className="pb-6" />
    </div>
  );
};