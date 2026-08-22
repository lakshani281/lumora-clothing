import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, LogOut } from 'lucide-react';
import { AuthModal } from './AuthModal';
import { useCart } from '../context/CartContext';

interface HeroSectionProps {
  setCurrentPage: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ setCurrentPage }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
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
  };

  return (
    <>
      <section className="relative bg-stone-900 text-white min-h-screen flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/prod-1.jpg"
            alt="Lumora Clothing Hero"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />
        </div>

        {/* Floating Navbar */}
        <nav className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif font-bold tracking-wider cursor-pointer flex items-center space-x-2" 
            onClick={() => setCurrentPage('home')}
          >
            <span>Lumora</span>
            <span className="text-[10px] uppercase tracking-widest font-sans font-normal text-amber-500">
              CLOTHING
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-xs font-medium">
            <button onClick={() => setCurrentPage('home')} className="bg-emerald-900/60 text-emerald-400 px-4 py-1.5 rounded-full transition">Home</button>
            <button onClick={() => setCurrentPage('products')} className="text-white hover:text-amber-400 transition">Products</button>
            <button onClick={() => setCurrentPage('bulk-orders')} className="text-white hover:text-amber-400 transition">Bulk Orders</button>
            <button onClick={() => setCurrentPage('about-us')} className="text-white hover:text-amber-400 transition">About Us</button>
            <button onClick={() => setCurrentPage('contact')} className="text-white hover:text-amber-400 transition">Contact</button>
          </div>

          <div className="flex items-center space-x-5 text-white/90">
            <button className="hover:text-amber-400 transition" title="Search"><Search size={18} /></button>
            <button className="hover:text-amber-400 transition" title="Wishlist"><Heart size={18} /></button>
            
            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="hover:text-amber-400 transition relative"
              title="Cart"
            >
              <ShoppingBag size={18} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1b5e3f] text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                <span className="text-xs font-semibold text-amber-400 hidden sm:inline">
                  Hi, {user.name.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="hover:text-red-400 transition" title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="hover:text-amber-400 transition flex items-center space-x-1" title="Login">
                <UserIcon size={18} />
                <span className="text-xs font-semibold hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 my-auto py-12">
          <span className="inline-block border border-amber-500/50 text-amber-400 text-[11px] uppercase tracking-[0.2em] px-5 py-1.5 rounded-full font-semibold mb-8 backdrop-blur-xs">
            PREMIUM SRI LANKAN APPAREL
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight mb-6 leading-tight">
            Wear Confidence. <br />
            <span className="italic font-normal">Wear Lumora.</span>
          </h1>

          <p className="text-stone-300 text-sm md:text-base max-w-xl mx-auto mb-10 font-light leading-relaxed">
            Premium T-shirts crafted with comfort, quality, and modern style for every occasion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setCurrentPage('products')} className="w-full sm:w-auto bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium px-8 py-3 rounded-full text-xs transition shadow-lg">
              Shop Collection
            </button>
            <button onClick={() => setCurrentPage('bulk-orders')} className="w-full sm:w-auto border border-white/40 hover:bg-white/10 text-white font-medium px-8 py-3 rounded-full text-xs transition backdrop-blur-xs">
              Bulk Orders
            </button>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(userData) => setUser(userData)}
      />
    </>
  );
};