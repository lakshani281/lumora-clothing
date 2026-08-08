import React from 'react';

export const CustomSolutions: React.FC = () => {
  const tags = ['Companies', 'Schools', 'Universities', 'Sports Teams', 'Events'];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="bg-[#f2ece4] rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 items-center">
        
        {/* Left Image Section */}
        <div className="h-full min-h-[350px] md:min-h-[480px] relative overflow-hidden">
          <img 
            src="/images/custom-solutions.jpg" 
            alt="Custom Solutions - Bring Your Design to Life" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Right Text Content Section */}
        <div className="p-8 md:p-14 lg:p-16 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-semibold mb-3">
            CUSTOM SOLUTIONS
          </span>

          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight mb-5">
            Bring Your Design <br />
            to Life
          </h2>

          <p className="text-gray-600 text-sm md:text-base font-light leading-relaxed mb-8 max-w-lg">
            Whether it's for your company, school, university, sports team, or special event — we bring your vision to fabric. Premium custom printing with fast turnaround and no minimum order disappointment.
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-stone-200/60 text-stone-700 text-xs font-medium px-4 py-2 rounded-full backdrop-blur-xs"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <div>
            <button className="bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium px-8 py-3.5 rounded-full text-sm transition duration-300 shadow-md flex items-center justify-center space-x-2">
              <span>Start Bulk Order</span>
              <span>&rarr;</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};