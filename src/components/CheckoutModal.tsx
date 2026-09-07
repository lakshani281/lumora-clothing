import React, { useState } from 'react';
import { X, CheckCircle, UploadCloud, Building2, FileCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const cartContext = useCart() as any;
  const currentItems = cartContext.items || cartContext.cartItems || [];
  const totalPrice = cartContext.totalPrice || cartContext.total || 0;
  const clearCart = cartContext.clearCart || (() => {});
  const setIsCartOpen = cartContext.setIsCartOpen || cartContext.setIsOpen || (() => {});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [slipImage, setSlipImage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Slip file එක Base64 එකකට convert කිරීම
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slipImage) {
      alert('Please upload your payment deposit slip or transfer screenshot to continue.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          email: formData.email,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          phone: formData.phone,
        },
        orderItems: currentItems.map((item: any) => ({
          product: item.productId || item._id || item.id,
          title: item.title,
          price: item.price,
          image: item.image || '/images/cat-men.jpg',
          size: item.size || 'M',
          color: item.color || 'Standard',
          quantity: item.quantity || 1,
        })),
        totalAmount: totalPrice + 350, // Delivery fee Rs. 350
        paymentSlip: slipImage,
      };

      const response = await API.post('/orders', orderPayload);

      if (response.data.success || response.data.order) {
        setIsSuccess(true);
        clearCart();
        setIsCartOpen(false);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Order placement failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 transition"
        >
          <X size={20} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle size={60} className="text-[#1b5e3f] mx-auto animate-bounce" />
            <h2 className="text-2xl font-serif font-bold text-stone-900">Order Placed Successfully!</h2>
            <p className="text-xs text-stone-600 leading-relaxed px-4">
              Thank you for ordering with Lumora Clothing. We have received your payment slip and will verify it shortly before dispatching your package.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-4 px-8 py-3 bg-[#1b5e3f] text-white text-xs font-semibold rounded-xl hover:bg-[#14472f] transition shadow-md"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-1">Checkout & Payment</h2>
            <p className="text-xs text-stone-500 mb-6">Enter delivery details and upload your transfer receipt.</p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  placeholder="Kasun Perera"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                    placeholder="kasun@gmail.com"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                    placeholder="077 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  placeholder="No. 12, Temple Road"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                    placeholder="Colombo"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                    placeholder="10100"
                  />
                </div>
              </div>

              {/* Bank Account Details Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#1b5e3f] font-semibold">
                  <Building2 size={16} />
                  <span>Direct Bank Deposit / Transfer Details</span>
                </div>
                <div className="text-[11px] text-stone-600 space-y-1 font-mono">
                  <p><span className="font-sans text-stone-400">Bank:</span> Commercial Bank</p>
                  <p><span className="font-sans text-stone-400">Account Name:</span> Lumora Clothing</p>
                  <p><span className="font-sans text-stone-400">Account No:</span> 8012345678</p>
                  <p><span className="font-sans text-stone-400">Branch:</span> Panadura Branch</p>
                </div>
              </div>

              {/* Payment Slip Upload Box */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  Upload Payment Slip / Screenshot <span className="text-red-500">*</span>
                </label>
                <label className="border-2 border-dashed border-stone-300 hover:border-[#1b5e3f] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-stone-50/50 group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {fileName ? (
                    <div className="flex items-center gap-2 text-[#1b5e3f] font-medium">
                      <FileCheck size={20} />
                      <span className="truncate max-w-[200px]">{fileName}</span>
                    </div>
                  ) : (
                    <div className="text-center space-y-1">
                      <UploadCloud size={24} className="mx-auto text-stone-400 group-hover:text-[#1b5e3f] transition" />
                      <p className="text-stone-600 font-medium">Click to select receipt image</p>
                      <p className="text-[10px] text-stone-400">PNG, JPG or Screenshot (Max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between text-sm font-bold text-stone-900">
                <span>Total (with delivery Rs. 350):</span>
                <span>Rs. {(totalPrice + 350).toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={loading || !slipImage || currentItems.length === 0}
                className="w-full py-3.5 bg-[#1b5e3f] hover:bg-[#14472f] text-white font-semibold rounded-2xl transition shadow-md disabled:opacity-50 text-sm mt-2 cursor-pointer"
              >
                {loading ? 'Processing Order...' : 'Submit Order with Slip'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};