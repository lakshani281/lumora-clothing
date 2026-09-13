import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, CheckCircle, LogIn, Building2, UploadCloud, FileCheck, Loader2 } from 'lucide-react';
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

  // Payment Slip Upload State
  const [slipImage, setSlipImage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  if (!isCartOpen) return null;

  // Real-time localStorage values
  const getAuthToken = () => localStorage.getItem('lumora_token') || localStorage.getItem('token');
  const getAuthUser = () => {
    try {
      const stored = localStorage.getItem('lumora_user') || localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const handleProceedToCheckout = () => {
    const currentToken = getAuthToken();
    if (!currentToken) {
      setError('Please sign in to your account to complete the checkout.');
      return;
    }
    setError('');
    setIsCheckingOut(true);
  };

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

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentToken = getAuthToken();
    const currentUser = getAuthUser();

    if (!currentToken) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    if (!slipImage) {
      setError('Please upload your payment deposit slip or transfer screenshot to continue.');
      return;
    }

    setLoading(true);

    try {
      // Backend එකට නිවැරදිව mapping වන data structure එක
      const orderData = {
        user: currentUser?.id || currentUser?._id, // User link කිරීම
        customer: {
          name: currentUser?.name || 'Valued Customer',
          email: currentUser?.email || 'customer@lumora.lk',
        },
        shippingAddress: { address, city, postalCode, phone },
        orderItems: cart.map((item) => ({
          name: item.title,
          product: item.productId,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          size: item.size || 'M',
          color: item.color || 'Standard',
          image: item.image,
        })),
        totalAmount,
        paymentMethod: 'Bank Transfer',
        paymentSlip: slipImage,
      };

      // Axios instance හෝ fetch එක හරහා Bearer token එක නිශ්චිතවම යැවීම
      const response = await API.post('/orders', orderData, {
        headers: { 
          Authorization: `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.data) {
        setOrderSuccess(true);
        clearCart();
      }
    } catch (err: any) {
      console.error('Order placement failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentUser = getAuthUser();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
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
                <p className="text-xs text-stone-600 leading-relaxed">
                  Thank you for shopping with Lumora Clothing. We have received your payment slip and linked it to your account.
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
                  <p className="text-xs font-bold text-stone-900">{currentUser?.name || 'Customer'}</p>
                  <p className="text-[11px] text-stone-600">{currentUser?.email}</p>
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

                {/* Bank Account Details Card */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center space-x-2 text-[#1b5e3f] font-semibold text-xs">
                    <Building2 size={16} />
                    <span>Direct Bank Deposit / Transfer Details</span>
                  </div>
                  <div className="text-[11px] text-stone-600 space-y-1 font-mono">
                    <p><span className="font-sans text-stone-400">Bank:</span> BOC</p>
                    <p><span className="font-sans text-stone-400">Account Name:</span> W.K.J.I.KUMARA</p>
                    <p><span className="font-sans text-stone-400">Account No:</span> 85860631</p>
                    <p><span className="font-sans text-stone-400">Branch:</span> Ranna Branch</p>
                  </div>
                </div>

                {/* Payment Slip Upload Box */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
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
                      <div className="flex items-center space-x-2 text-[#1b5e3f] font-medium text-xs">
                        <FileCheck size={18} />
                        <span className="truncate max-w-[200px]">{fileName}</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-1">
                        <UploadCloud size={22} className="mx-auto text-stone-400 group-hover:text-[#1b5e3f] transition" />
                        <p className="text-xs text-stone-600 font-medium">Click to select receipt image</p>
                        <p className="text-[10px] text-stone-400">PNG, JPG or Screenshot (Max 5MB)</p>
                      </div>
                    )}
                  </label>
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
                    disabled={loading || !slipImage} 
                    className="w-2/3 bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold disabled:opacity-50 transition shadow-md flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Submitting Order...</span>
                      </>
                    ) : (
                      <span>Confirm Order with Slip</span>
                    )}
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleProceedToCheckout} 
                  className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white py-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <span>Proceed to Checkout</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};