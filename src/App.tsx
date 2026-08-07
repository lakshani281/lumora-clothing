import React from 'react';
import { HeroSection } from './components/HeroSection';
import { CategoriesSection } from './components/CategoriesSection';
import { NewArrivals } from './components/NewArrivals';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HeroSection />
      <CategoriesSection />
      <NewArrivals />
    </div>
  );
};

export default App;