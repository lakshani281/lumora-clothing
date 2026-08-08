import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1918] text-gray-300 font-sans pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
        
        {/* Column 1: Brand Info */}
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-2xl font-serif font-bold text-white tracking-wide">Lumora</h3>
            <span className="text-xs uppercase tracking-widest text-amber-600 font-semibold">CLOTHING</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Premium Sri Lankan T-shirts for individuals and businesses. Crafted with comfort, confidence, and style.
          </p>
          {/* Social Icons */}
          <div className="flex items-center space-x-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 text-white flex items-center justify-center text-xs transition">f</a>
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 text-white flex items-center justify-center text-xs transition">in</a>
            <a href="#" className="w-9 h-9 rounded-full bg-stone-800 hover:bg-emerald-800 text-white flex items-center justify-center text-xs transition">tw</a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">QUICK LINKS</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Products</a></li>
            <li><a href="#" className="hover:text-white transition">Bulk Orders</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Products */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">PRODUCTS</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition">Men's Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Women's Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Kids' Collection</a></li>
            <li><a href="#" className="hover:text-white transition">Custom T-Shirts</a></li>
            <li><a href="#" className="hover:text-white transition">Bulk Orders</a></li>
          </ul>
        </div>

        {/* Column 4: Contact (Moved to top & updated details) */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-5">CONTACT</h4>
          <div className="space-y-3 text-sm text-gray-400">
            <p className="text-gray-200 font-medium">+944262874</p>
            <p className="hover:text-white transition">lumoraclothingpvt(Ltd)@gmail.com</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
        <p>&copy; 2026 Lumora Clothing. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};