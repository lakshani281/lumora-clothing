import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string;
  image?: string;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  orderItems: OrderItem[];
}

export const ProfilePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // LocalStorage keys lumora_user සහ lumora_token ලෙස නිවැරදි කිරීම
  const storedUser = localStorage.getItem('lumora_user') 
    ? JSON.parse(localStorage.getItem('lumora_user')!) 
    : null;
  const token = localStorage.getItem('lumora_token');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await axios.get('https://lumora-clothing-production.up.railway.app/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyOrders();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      {/* 1. Customer Details Card */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{storedUser?.name || 'Customer Profile'}</h1>
          <p className="text-gray-500 text-sm mt-1">{storedUser?.email || 'Logged in user'}</p>
        </div>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
          Active Account
        </span>
      </div>

      {/* 2. Orders List Section */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Orders & Live Status</h2>

      {loading ? (
        <p className="text-gray-500">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 text-gray-500">
          No orders found yet. Start shopping!
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const shortId = order._id.slice(-6).toUpperCase();
            return (
              <div key={order._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex flex-wrap justify-between items-center border-b border-gray-100 pb-3 mb-4 gap-2">
                  <div>
                    <span className="text-xs text-gray-400">Order ID</span>
                    <h3 className="font-bold text-gray-800">#{shortId}</h3>
                    <span className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Payment Status Badges */}
                  <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">Payment:</span>
                    {order.paymentStatus === 'Verified' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    )}
                    {order.paymentStatus === 'Rejected' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                        ✕ Slip Rejected
                      </span>
                    )}
                    {order.paymentStatus !== 'Verified' && order.paymentStatus !== 'Rejected' && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                        ⏳ Verifying Slip
                      </span>
                    )}

                    {/* Order Fulfillment Status */}
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                      {order.status || 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="divide-y divide-gray-50">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border" />
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {item.size || 'M'} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-700">Rs. {item.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Paid</span>
                  <span className="text-lg font-bold text-gray-900">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;