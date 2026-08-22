import React, { useState } from 'react';
import { X, CheckCircle, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const cartContext = useCart() as any;
  // CartContext එකේ නම items හෝ cartItems විය හැක
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
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card'>('COD');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend Order Schema එකට අදාළ payload එක
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
        paymentMethod,
      };

      const response = await API.post('/orders', orderPayload);

      if (response.data.success || response.data.order) {
        setIsSuccess(true);
        clearCart();
        setIsCartOpen(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Order placement failed. Please try again.');
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
            <p className="text-xs text-stone-600">
              Thank you for ordering with Lumora Clothing. We have received your order.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="mt-4 px-8 py-3 bg-[#1b5e3f] text-white text-xs font-semibold rounded-xl hover:bg-[#14472f] transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">Complete Checkout</h2>

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

              <div>
                <label className="font-semibold text-stone-700 block mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`border p-3 rounded-2xl cursor-pointer flex items-center gap-2 transition ${
                      paymentMethod === 'COD'
                        ? 'border-[#1b5e3f] bg-[#1b5e3f]/5 text-[#1b5e3f] font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <Truck size={18} />
                    <span>Cash on Delivery</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`border p-3 rounded-2xl cursor-pointer flex items-center gap-2 transition ${
                      paymentMethod === 'Card'
                        ? 'border-[#1b5e3f] bg-[#1b5e3f]/5 text-[#1b5e3f] font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Card / PayHere</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-3 flex justify-between text-sm font-bold text-stone-900">
                <span>Total (with delivery Rs. 350):</span>
                <span>Rs. {(totalPrice + 350).toLocaleString()}</span>
              </div>

              <button
                type="submit"
                disabled={loading || currentItems.length === 0}
                className="w-full py-3.5 bg-[#1b5e3f] hover:bg-[#14472f] text-white font-semibold rounded-2xl transition shadow-md disabled:opacity-50 text-sm mt-2"
              >
                {loading ? 'Processing Order...' : 'Confirm Order'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};