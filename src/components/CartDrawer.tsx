import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, CreditCard, CheckCircle, LogIn, ShieldCheck, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import API from '../services/api';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);

  // Checkout Form State
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card'>('COD');

  // Dummy Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  if (!isCartOpen) return null;

  const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('lumora_user') || localStorage.getItem('user') || '{}');

  const handleProceedToCheckout = () => {
    if (!token) {
      setError('Please sign in to your account to complete the checkout.');
      return;
    }
    setError('');
    setIsCheckingOut(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    if (paymentMethod === 'Card') {
      setShowCardModal(true);
    } else {
      executeOrderPlacement('COD');
    }
  };

  const executeOrderPlacement = async (finalPaymentMethod: 'COD' | 'Card') => {
    setLoading(true);
    try {
      const orderData = {
        customer: {
          name: user?.name || 'Valued Customer',
          email: user?.email || 'customer@lumora.lk',
        },
        shippingAddress: { address, city, postalCode, phone },
        orderItems: cart.map((item) => ({
          product: item.productId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color || 'Standard',
          image: item.image,
        })),
        totalAmount,
        paymentMethod: finalPaymentMethod,
      };

      const response = await API.post('/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success || response.data.order) {
        setShowCardModal(false);
        setOrderSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
      setIsProcessingPayment(false);
    }
  };

  const handleSimulatedCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setTimeout(() => {
      executeOrderPlacement('Card');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => {
          if (!showCardModal) setIsCartOpen(false);
        }} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between relative">
          
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag size={20} className="text-[#1b5e3f]" />
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {isCheckingOut ? 'Checkout Details' : 'Your Shopping Bag'}
              </h2>
            </div>
            <button 
              onClick={() => { 
                setIsCartOpen(false); 
                setIsCheckingOut(false); 
                setOrderSuccess(false); 
                setShowCardModal(false);
              }} 
              className="text-stone-400 hover:text-stone-700 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {orderSuccess ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle size={60} className="text-[#1b5e3f] mx-auto animate-bounce" />
                <h3 className="text-xl font-serif font-bold text-stone-900">Order Placed Successfully!</h3>
                <p className="text-xs text-stone-600">
                  Thank you for shopping with Lumora Clothing. Your order has been recorded in the database.
                </p>
                <button 
                  onClick={() => { 
                    setIsCartOpen(false); 
                    setOrderSuccess(false); 
                    setIsCheckingOut(false); 
                  }} 
                  className="mt-4 bg-[#1b5e3f] hover:bg-[#14472f] text-white px-6 py-2.5 rounded-xl text-xs font-semibold transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs">{error}</div>}
                
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold block mb-0.5">Ordering As</span>
                  <p className="text-xs font-bold text-stone-900">{user?.name || 'Customer'}</p>
                  <p className="text-[11px] text-stone-600">{user?.email}</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="0771234567" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1b5e3f]" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address</label>
                  <input 
                    type="text" 
                    required 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="No 12, Galle Road" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1b5e3f]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">City</label>
                    <input 
                      type="text" 
                      required 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      placeholder="Colombo" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1b5e3f]" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Postal Code</label>
                    <input 
                      type="text" 
                      required 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)} 
                      placeholder="00300" 
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1b5e3f]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setPaymentMethod('COD')}
                      className={`border p-2.5 rounded-xl cursor-pointer flex items-center space-x-2 text-xs transition ${
                        paymentMethod === 'COD'
                          ? 'border-[#1b5e3f] bg-[#1b5e3f]/5 text-[#1b5e3f] font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <Truck size={16} />
                      <span>COD</span>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('Card')}
                      className={`border p-2.5 rounded-xl cursor-pointer flex items-center space-x-2 text-xs transition ${
                        paymentMethod === 'Card'
                          ? 'border-[#1b5e3f] bg-[#1b5e3f]/5 text-[#1b5e3f] font-bold'
                          : 'border-stone-200 text-stone-600'
                      }`}
                    >
                      <CreditCard size={16} />
                      <span>Online Card</span>
                    </div>
                  </div>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="text-center py-16 text-stone-500">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Your bag is currently empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                    <LogIn size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
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

          {!orderSuccess && cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Total Amount</span>
                <span className="text-[#1b5e3f]">Rs. {totalAmount.toLocaleString()}</span>
              </div>
              {isCheckingOut ? (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setIsCheckingOut(false)} 
                    className="w-1/3 border border-stone-300 py-3 rounded-xl text-xs font-semibold hover:bg-stone-100 transition"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    form="checkout-form" 
                    disabled={loading} 
                    className="w-2/3 bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold disabled:opacity-50 transition shadow-md flex items-center justify-center space-x-2"
                  >
                    <span>{paymentMethod === 'Card' ? 'Proceed to Pay' : 'Confirm Order'}</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleProceedToCheckout} 
                  className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}

          {/* Clean In-App Card Payment Modal */}
          {showCardModal && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col justify-between p-6 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck size={22} className="text-[#1b5e3f]" />
                    <h3 className="font-bold text-stone-900 text-base">Secure Card Checkout</h3>
                  </div>
                  <button onClick={() => setShowCardModal(false)} className="text-stone-400 hover:text-stone-700">
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-[#1b5e3f]/5 border border-[#1b5e3f]/20 p-3.5 rounded-2xl mb-6">
                  <div className="flex justify-between text-xs text-stone-600 mb-1">
                    <span>Payable Amount:</span>
                    <span className="font-bold text-[#1b5e3f] text-sm">Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Encrypted 256-bit Sandbox Payment Gateway</p>
                </div>

                <form onSubmit={handleSimulatedCardPay} id="card-pay-form" className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Card Number</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={19}
                      placeholder="4000 1234 5678 9010" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono text-sm focus:outline-none focus:border-[#1b5e3f]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Expiry Date</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={5}
                        placeholder="MM/YY" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1b5e3f]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">CVV / CVC</label>
                      <input 
                        type="password" 
                        required 
                        maxLength={3}
                        placeholder="123" 
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-[#1b5e3f]"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  type="submit"
                  form="card-pay-form"
                  disabled={isProcessingPayment}
                  className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 transition"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Verifying & Charging Card...</span>
                    </>
                  ) : (
                    <span>Pay Rs. {totalAmount.toLocaleString()}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCardModal(false)}
                  disabled={isProcessingPayment}
                  className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};