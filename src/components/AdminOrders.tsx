import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChevronDown } from 'lucide-react';
import API from '../services/api';

interface OrderItem {
  product: string;
  title: string;
  quantity: number;
  price: number;
  size: string;
  color?: string;
  image: string;
}

interface OrderType {
  _id: string;
  customer?: {
    name: string;
    email: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
  orderItems: OrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'Card';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      const response = await API.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      await API.patch(
        `/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus as any } : ord))
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800"><CheckCircle2 size={12}/> Delivered</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800"><Truck size={12}/> Shipped</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800"><Clock size={12}/> Processing</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800"><XCircle size={12}/> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-200 text-stone-700"><Package size={12}/> Pending</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-16 text-stone-500 font-medium">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Customer Orders</h2>
          <p className="text-xs text-stone-500">Manage real-time customer purchases and fulfillment statuses</p>
        </div>
        <span className="text-xs bg-[#1b5e3f]/10 text-[#1b5e3f] font-bold px-3 py-1 rounded-full">
          Total Orders: {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/70 text-stone-500 text-sm">
          No customer orders found yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200/70 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-stone-800">#{order._id.slice(-6).toUpperCase()}</span>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-800">{order.customer?.name || 'Customer'}</p>
                      <p className="text-[11px] text-stone-500">{order.shippingAddress?.phone}</p>
                      <p className="text-[11px] text-stone-400 truncate max-w-[150px]">
                        {order.shippingAddress?.city}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <img src={item.image} alt={item.title} className="w-6 h-6 rounded-md object-cover bg-stone-100" />
                            <span className="text-stone-700 truncate max-w-[140px]">{item.title} ({item.size}) x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1b5e3f]">
                      Rs. {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-700">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(order.status)}
                        <div className="relative inline-block">
                          <select
                            disabled={updatingId === order._id}
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="text-[11px] font-semibold bg-stone-100 border border-stone-300 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-[#1b5e3f]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};