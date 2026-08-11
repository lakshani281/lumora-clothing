import React, { useState } from 'react';

interface ContactPageProps {
  setCurrentPage?: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const faqs: FAQItem[] = [
    {
      question: 'How long does delivery take?',
      answer:
        'Standard island-wide delivery takes 3–5 business days. Express delivery (1–2 days) is available for an additional charge.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We accept returns within 14 days of delivery for unused, unwashed items in original packaging. Custom-printed items are non-refundable.',
    },
    {
      question: 'What is the minimum for bulk orders?',
      answer:
        'Our minimum bulk order quantity is 25 pieces per design. Discounts apply at 50, 100, and 500+ pieces.',
    },
    {
      question: 'Can I see a sample before placing a bulk order?',
      answer:
        'Yes! We produce a sample for all bulk orders above 100 pieces at no additional cost. Samples for smaller runs are charged at cost.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept bank transfers, credit/debit cards, and cash on delivery for orders under Rs. 10,000.',
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will contact you shortly.');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero Banner Section */}
      <section className="relative bg-[#2d3748] text-white py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-0" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <span className="text-amber-400 text-xs uppercase tracking-widest font-semibold block mb-3">
            GET IN TOUCH
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">
            We'd Love to Hear From You
          </h1>
        </div>
      </section>

      {/* Main Content: Contact Info & Form */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Contact Information
            </h2>

            <div className="space-y-4">
              <div className="bg-[#f2eee9] p-5 rounded-2xl flex items-center space-x-4">
                <div className="text-xl">📞</div>
                <div>
                  <p className="text-xs text-stone-500 font-medium">Phone</p>
                  <p className="font-bold text-stone-800 text-sm">
                    +944262874
                  </p>
                </div>
              </div>

              <div className="bg-[#f2eee9] p-5 rounded-2xl flex items-center space-x-4">
                <div className="text-xl">✉️</div>
                <div>
                  <p className="text-xs text-stone-500 font-medium">Email</p>
                  <p className="font-bold text-stone-800 text-sm break-all">
                    lumoraclothingpvt(Ltd)@gmail.com
                  </p>
                </div>
              </div>

              <div className="bg-[#f2eee9] p-5 rounded-2xl flex items-center space-x-4">
                <div className="text-xl">📍</div>
                <div>
                  <p className="text-xs text-stone-500 font-medium">Address</p>
                  <p className="font-bold text-stone-800 text-sm">
                    No 91/1, 100 Feet Road, Ranna
                  </p>
                </div>
              </div>

              <div className="bg-[#f2eee9] p-5 rounded-2xl flex items-center space-x-4">
                <div className="text-xl">⏰</div>
                <div>
                  <p className="text-xs text-stone-500 font-medium">
                    Business Hours
                  </p>
                  <p className="font-bold text-stone-800 text-sm">
                    Mon–Sat: 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <span className="text-stone-500 text-xs font-bold uppercase tracking-wider block mb-4">
                FOLLOW US
              </span>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="bg-[#f2eee9] hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-2 transition-colors">
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button type="button" className="bg-[#f2eee9] hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-2 transition-colors">
                  <span>📷</span>
                  <span>Instagram</span>
                </button>
                <button type="button" className="bg-[#f2eee9] hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-2 transition-colors">
                  <span>🐤</span>
                  <span>Twitter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#f2eee9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#f2eee9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#f2eee9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#f2eee9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#f2eee9] border-none rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium py-3.5 rounded-2xl transition-colors flex items-center justify-center space-x-2 text-sm shadow-xs"
                >
                  <span>Send Message</span>
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-600 text-xs uppercase tracking-widest font-bold block mb-2">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center space-x-4 focus:outline-none"
                >
                  <span className="font-semibold text-stone-900 text-sm md:text-base">
                    {faq.question}
                  </span>
                  <span className="text-emerald-800 font-bold text-lg">
                    {isOpen ? '✕' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-stone-600 text-xs md:text-sm leading-relaxed border-t border-stone-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};