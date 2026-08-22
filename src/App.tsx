import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { NewArrivals } from './components/NewArrivals';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomSolutions } from './components/CustomSolutions';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ProductsPage } from './pages/ProductsPage';
import { BulkOrdersPage } from './pages/BulkOrdersPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';

const App: React.FC = () => {
  // Browser URL එක /admin ද කියා ආරම්භයේදීම හඳුනා ගැනීම
  const getInitialPage = () => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'admin') return 'admin';
    if (path === 'products') return 'products';
    if (path === 'bulk-orders') return 'bulk-orders';
    if (path === 'about-us') return 'about-us';
    if (path === 'contact') return 'contact';
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<string>(getInitialPage());

  // URL එක වෙනස් වන විට page එක update කිරීම
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace('/', '');
      if (path === 'admin') setCurrentPage('admin');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between">
        <div>
          {currentPage !== 'home' && (
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
          )}

          {/* Home Page View */}
          {currentPage === 'home' && (
            <main>
              <HeroSection setCurrentPage={setCurrentPage} />
              <CategoriesSection setCurrentPage={setCurrentPage} />
              <NewArrivals setCurrentPage={setCurrentPage} />
              <WhyChooseUs />
              <CustomSolutions setCurrentPage={setCurrentPage} />
              <Newsletter />
            </main>
          )}

          {/* Products Page View */}
          {currentPage === 'products' && (
            <main>
              <ProductsPage />
            </main>
          )}

          {/* Bulk Orders View */}
          {currentPage === 'bulk-orders' && (
            <main>
              <BulkOrdersPage setCurrentPage={setCurrentPage} />
            </main>
          )}

          {/* About Us View */}
          {currentPage === 'about-us' && (
            <main>
              <AboutUsPage setCurrentPage={setCurrentPage} />
            </main>
          )}

          {/* Contact View */}
          {currentPage === 'contact' && (
            <main>
              <ContactPage setCurrentPage={setCurrentPage} />
            </main>
          )}

          {/* Admin Dashboard View */}
          {currentPage === 'admin' && (
            <main>
              <AdminDashboardPage />
            </main>
          )}

          {/* Fallback Condition */}
          {currentPage !== 'home' &&
            currentPage !== 'products' &&
            currentPage !== 'bulk-orders' &&
            currentPage !== 'about-us' &&
            currentPage !== 'contact' &&
            currentPage !== 'admin' && (
              <div className="max-w-7xl mx-auto px-6 py-24 text-center">
                <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 capitalize">
                  {currentPage.replace('-', ' ')}
                </h2>
                <p className="text-gray-500">This page is under construction.</p>
              </div>
            )}
        </div>

        <Footer />
        
        {/* Global Cart Slide-over Drawer */}
        <CartDrawer />
      </div>
    </CartProvider>
  );
};

export default App;