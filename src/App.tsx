import React from 'react';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { NewArrivals } from './components/NewArrivals';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomSolutions } from './components/CustomSolutions';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HeroSection />
      <CategoriesSection />
      <NewArrivals />
      <WhyChooseUs />
      <CustomSolutions />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default App;