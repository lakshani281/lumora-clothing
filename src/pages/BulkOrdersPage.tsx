import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface BulkOrdersPageProps {
  setCurrentPage: (page: string) => void;
}

export const BulkOrdersPage: React.FC<BulkOrdersPageProps> = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    productType: '',
    quantity: '',
    fabric: '',
    printingMethod: '',
    specialRequirements: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your inquiry! Our team will contact you within 24 hours.');
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      productType: '',
      quantity: '',
      fabric: '',
      printingMethod: '',
      specialRequirements: '',
    });
  };

  const industries = [
    { name: 'Companies', icon: '🏢' },
    { name: 'Schools', icon: '🏫' },
    { name: 'Universities', icon: '🎓' },
    { name: 'Hotels', icon: '🏨' },
    { name: 'Sports Clubs', icon: '⚽' },
    { name: 'Events', icon: '🎉' },
  ];

  const processSteps = [
    {
      num: '01',
      title: 'Submit Request',
      desc: 'Fill in your requirements and submit your bulk order inquiry.',
    },
    {
      num: '02',
      title: 'Design Discussion',
      desc: 'Our team contacts you to finalize design, sizes, and quantities.',
    },
    {
      num: '03',
      title: 'Quotation',
      desc: 'Receive a detailed quote with pricing and timeline.',
    },
    {
      num: '04',
      title: 'Sample Approval',
      desc: 'We produce a sample for your approval before full production.',
    },
    {
      num: '05',
      title: 'Production',
      desc: 'Full production begins with quality checks at every stage.',
    },
    {
      num: '06',
      title: 'Delivery',
      desc: 'Your order is delivered island-wide on schedule.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Banner Section */}
      <section className="relative bg-[#2d3748] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-3">
            FOR BUSINESSES
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            Custom Apparel Solutions for Businesses
          </h1>
        </div>
      </section>

      {/* Industries We Work With Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
          WE SERVE
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-12">
          Industries We Work With
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-xs border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition cursor-pointer"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Our Bulk Order Process Section */}
      <section className="py-20 px-6 bg-[#f3efe8]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-14">
            Our Bulk Order Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl text-left relative shadow-xs border border-stone-200/60"
              >
                <div className="text-amber-500 font-serif text-3xl font-bold mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request a Quote Form Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
            GET STARTED
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">
            Request a Quote
          </h2>
          <p className="text-stone-600 text-sm">
            Fill out the form and our team will respond within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200/80 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Product Type
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none text-stone-700 cursor-pointer"
              >
                <option value="">Select product</option>
                <option value="round-neck">Round Neck T-Shirt</option>
                <option value="polo">Polo T-Shirt</option>
                <option value="v-neck">V-Neck T-Shirt</option>
                <option value="hoodie">Hoodie</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="e.g. 100"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Fabric
              </label>
              <select
                name="fabric"
                value={formData.fabric}
                onChange={handleChange}
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none text-stone-700 cursor-pointer"
              >
                <option value="">Select fabric</option>
                <option value="cotton">100% Cotton</option>
                <option value="blend">Cotton Polyester Blend</option>
                <option value="dri-fit">Performance Dri-Fit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Printing Method
              </label>
              <select
                name="printingMethod"
                value={formData.printingMethod}
                onChange={handleChange}
                className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none text-stone-700 cursor-pointer"
              >
                <option value="">Select method</option>
                <option value="screen">Screen Printing</option>
                <option value="dtg">DTG Printing</option>
                <option value="embroidery">Embroidery</option>
                <option value="heat-transfer">Heat Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-2">
              Special Requirements
            </label>
            <textarea
              name="specialRequirements"
              rows={4}
              placeholder="Describe your design, color preferences, deadline, or any special notes..."
              value={formData.specialRequirements}
              onChange={handleChange}
              className="w-full bg-[#f4f1ea] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1b5e3f] outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition shadow-md cursor-pointer"
          >
            <span>Request a Quote</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </section>
    </div>
  );
};