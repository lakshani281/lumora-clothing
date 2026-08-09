import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { NewArrivals } from './components/NewArrivals';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomSolutions } from './components/CustomSolutions';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { ProductsPage } from './pages/ProductsPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {/* Dynamic Page Content */}
        {currentPage === 'home' && (
          <main>
            <HeroSection />
            <CategoriesSection />
            <NewArrivals />
            <WhyChooseUs />
            <CustomSolutions />
            <Newsletter />
          </main>
        )}

        {currentPage === 'products' && (
          <main>
            <ProductsPage />
          </main>
        )}

        {currentPage !== 'home' && currentPage !== 'products' && (
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 capitalize">
              {currentPage.replace('-', ' ')}
            </h2>
            <p className="text-gray-500">This page is under construction.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;