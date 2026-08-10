import React from 'react';

interface AboutUsPageProps {
  setCurrentPage?: (page: string) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = () => {
  const values = [
    {
      icon: '🏆',
      title: 'Quality',
      description:
        'Every stitch is inspected. We never compromise on the quality of our fabric or finish.',
    },
    {
      icon: '💡',
      title: 'Innovation',
      description:
        'From design to printing, we stay ahead with the latest techniques and technology.',
    },
    {
      icon: '❤️',
      title: 'Customer Satisfaction',
      description:
        'Our customers are at the heart of everything we do — from design to doorstep.',
    },
    {
      icon: '🌱',
      title: 'Sustainability',
      description:
        "We're committed to responsible sourcing and eco-friendly production practices.",
    },
  ];

  const processSteps = [
    { num: 1, label: 'Design' },
    { num: 2, label: 'Fabric Selection' },
    { num: 3, label: 'Printing' },
    { num: 4, label: 'Stitching' },
    { num: 5, label: 'Quality Inspection' },
    { num: 6, label: 'Packaging' },
    { num: 7, label: 'Delivery' },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Banner */}
      <section className="relative bg-[#2d3748] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-3">
            EST. 2018
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Our Story
          </h1>
        </div>
      </section>

      {/* Made in Sri Lanka Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
              ABOUT LUMORA
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Made in Sri Lanka, Worn Everywhere
            </h2>
            <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
              <p>
                Lumora Clothing was born in 2018 with a simple belief: that everyone
                deserves to wear something that feels as good as it looks. Starting from a
                small workshop in Colombo, we've grown into one of Sri Lanka's most
                trusted T-shirt manufacturers.
              </p>
              <p>
                Today, we serve thousands of individual customers and hundreds of
                businesses across the island, producing premium apparel that combines
                craftsmanship, comfort, and contemporary style.
              </p>
            </div>
          </div>
          
            <div className="rounded-3xl overflow-hidden shadow-sm">
                <img
                     src="/images/about-workshop.jpg" 
                     alt="Lumora Workshop"
                     className="w-full h-[380px] object-cover"
                     />
                 </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="text-4xl mb-4">🔭</div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              To be South Asia's most admired apparel brand — one that communities
              reach for when they want to wear confidence.
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Deliver premium-quality, sustainably produced T-shirts to every customer
              while empowering businesses with custom manufacturing excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
          WHAT DRIVES US
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-12">
          Our Values
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col items-center text-center"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-serif font-bold text-gray-900 text-lg mb-3">
                {item.title}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Manufacturing Process Section */}
      <section className="py-20 px-6 bg-[#f3efe8] text-center">
        <div className="max-w-7xl mx-auto">
          <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
            CRAFTSMANSHIP
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-16">
            Our Manufacturing Process
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {processSteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center font-bold text-sm mb-3 shadow-sm">
                    {step.num}
                  </div>
                  <span className="text-stone-800 text-xs font-semibold max-w-[90px] leading-tight">
                    {step.label}
                  </span>
                </div>
                {idx < processSteps.length - 1 && (
                  <span className="text-stone-400 font-light mb-6 hidden sm:inline">
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};