import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Checkout Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  if (!isCartOpen) return null;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('lumora_token');
    if (!token) {
      setError('Please login first to place an order.');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item.productId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
          image: item.image,
        })),
        shippingAddress: { address, city, postalCode, phone },
        totalAmount,
        paymentMethod: 'COD',
      };

      await API.post('/orders', orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-[#1b5e3f]" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {isCheckingOut ? 'Checkout Details' : 'Your Shopping Bag'}
              </h2>
            </div>
            <button onClick={() => { setIsCartOpen(false); setIsCheckingOut(false); setOrderSuccess(false); }} className="text-stone-400 hover:text-stone-700">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto">
            {orderSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-[#1b5e3f] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h3 className="text-xl font-serif font-bold text-stone-900">Order Placed Successfully!</h3>
                <p className="text-xs text-stone-600">We have received your order and will contact you for confirmation.</p>
                <button onClick={() => { setIsCartOpen(false); setOrderSuccess(false); setIsCheckingOut(false); }} className="mt-4 bg-[#1b5e3f] text-white px-6 py-2.5 rounded-xl text-xs font-semibold">
                  Continue Shopping
                </button>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs">{error}</div>}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} placeholder="No 12, Galle Road" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#1b5e3f]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="Colombo" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#1b5e3f]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code</label>
                    <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="00300" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#1b5e3f]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0771234567" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-[#1b5e3f]" />
                </div>
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                  <span className="font-bold">Payment Method:</span> Cash on Delivery (COD)
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-stone-500">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Your bag is currently empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex space-x-4 border-b border-stone-100 pb-4">
                    <img src={item.image} alt={item.title} className="w-20 h-24 object-cover rounded-lg bg-stone-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-stone-900">{item.title}</h4>
                        <p className="text-xs text-stone-500">Size: {item.size} | Color: {item.color}</p>
                        <p className="text-xs font-bold text-[#1b5e3f] mt-1">Rs. {item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-stone-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)} className="px-2.5 py-0.5 text-xs hover:bg-stone-100">-</button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)} className="px-2.5 py-0.5 text-xs hover:bg-stone-100">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId, item.size, item.color)} className="text-stone-400 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!orderSuccess && cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Subtotal</span>
                <span className="text-[#1b5e3f]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              {isCheckingOut ? (
                <div className="flex space-x-3">
                  <button onClick={() => setIsCheckingOut(false)} className="w-1/3 border border-stone-300 py-3 rounded-xl text-xs font-semibold hover:bg-stone-100">Back</button>
                  <button type="submit" form="checkout-form" disabled={loading} className="w-2/3 bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold disabled:opacity-50">
                    {loading ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsCheckingOut(true)} className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};