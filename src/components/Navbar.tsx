import React from 'react';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'bulk-orders', label: 'Bulk Orders' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#faf8f5]/90 backdrop-blur-md border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => setCurrentPage('home')}
          className="flex items-center space-x-2 cursor-pointer select-none"
        >
          <span className="text-2xl font-serif font-bold text-gray-900 tracking-wide">Lumora</span>
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold pt-1">
            CLOTHING
          </span>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#e2e8e4] text-[#1b5e3f] font-semibold'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Action Icons */}
        <div className="flex items-center space-x-5 text-gray-800">
          <button className="hover:text-emerald-800 transition p-1" title="Search">
            <Search size={20} strokeWidth={1.8} />
          </button>
          <button className="hover:text-emerald-800 transition p-1 relative" title="Wishlist">
            <Heart size={20} strokeWidth={1.8} />
          </button>
          <button className="hover:text-emerald-800 transition p-1 relative" title="Cart">
            <ShoppingBag size={20} strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 bg-[#1b5e3f] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
          <button className="hover:text-emerald-800 transition p-1" title="Account">
            <User size={20} strokeWidth={1.8} />
          </button>
        </div>

      </div>
    </header>
  );
};