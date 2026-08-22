import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role?: string } | null>(null);
  const { totalItemsCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const savedUser = localStorage.getItem('lumora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('lumora_token');
    localStorage.removeItem('lumora_user');
    setUser(null);
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'bulk-orders', label: 'Bulk Orders' },
    { id: 'about-us', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
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
          <div className="flex items-center space-x-4 md:space-x-5 text-gray-800">
            
            {/* User 'admin' ලෙස Login වී ඇත්නම් පමණක් Admin Button එක පෙන්වයි */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  currentPage === 'admin'
                    ? 'bg-[#1b5e3f] text-white'
                    : 'bg-stone-200/70 hover:bg-stone-200 text-stone-800'
                }`}
                title="Admin Portal"
              >
                <ShieldCheck size={15} />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            <button className="hover:text-emerald-800 transition p-1" title="Search">
              <Search size={20} strokeWidth={1.8} />
            </button>

            <button className="hover:text-emerald-800 transition p-1 relative" title="Wishlist">
              <Heart size={20} strokeWidth={1.8} />
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:text-emerald-800 transition p-1 relative" 
              title="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1b5e3f] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Account State */}
            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-stone-300">
                <span className="text-xs font-semibold text-stone-800 hidden sm:inline">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-stone-500 hover:text-red-600 transition p-1"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={1.8} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="hover:text-emerald-800 transition p-1 flex items-center space-x-1"
                title="Login / Register"
              >
                <UserIcon size={20} strokeWidth={1.8} />
                <span className="text-xs font-semibold hidden sm:inline">Login</span>
              </button>
            )}
          </div>

        </div>
      </header>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => setUser(userData)}
      />
    </>
  );
};