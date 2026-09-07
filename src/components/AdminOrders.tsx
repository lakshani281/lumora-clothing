import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Eye, 
  X, 
  Check, 
  ShieldAlert, 
  Download, 
  ExternalLink,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
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
  paymentMethod: string;
  paymentSlip: string;
  paymentStatus: 'Pending Verification' | 'Verified' | 'Rejected';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<{ id: string; img: string; customer: string } | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      console.log('Sending Token to /orders:', token ? 'Token exists' : 'No token found');

      const response = await API.get('/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Fetched Orders:', response.data);
      setOrders(response.data || []);
    } catch (error: any) {
      console.error('Error fetching admin orders:', error);
      if (error.response?.status === 403) {
        setErrorMsg('Access Denied (403): Your account role is not set to "admin" in the database. Please update MongoDB and re-login.');
      } else if (error.response?.status === 401) {
        setErrorMsg('Authentication Error (401): Please login again to refresh your session.');
      } else {
        setErrorMsg(error.response?.data?.message || 'Failed to load customer orders from server.');
      }
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
      alert('Order status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, paymentStatus: string) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      await API.patch(
        `/orders/${orderId}/payment-status`,
        { paymentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, paymentStatus: paymentStatus as any } : ord))
      );
    } catch (error) {
      console.error('Failed to update payment status:', error);
      alert('Payment status update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800"><CheckCircle2 size={12}/> Delivered</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"><Truck size={12}/> Shipped</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"><Clock size={12}/> Processing</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800"><XCircle size={12}/> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700"><Package size={12}/> Pending</span>;
    }
  };

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'Verified':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800"><Check size={12}/> Verified</span>;
      case 'Rejected':
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800"><ShieldAlert size={12}/> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800"><Clock size={12}/> Pending Review</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-500 space-y-3">
        <RefreshCw size={24} className="animate-spin text-[#1b5e3f]" />
        <p className="text-sm font-medium">Loading Lumora customer orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Customer Orders</h2>
          <p className="text-xs text-stone-500">Review customer bank transfer slips and update parcel status</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-1.5 text-xs text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
          <span className="text-xs bg-[#1b5e3f]/10 text-[#1b5e3f] font-bold px-3 py-1 rounded-full">
            Total Orders: {orders.length}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed">
          <AlertTriangle size={18} className="shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">Error loading orders</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {orders.length === 0 && !errorMsg ? (
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
                  <th className="py-3 px-4">Payment Slip</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Fulfillment</th>
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
                      <p className="text-[11px] text-stone-400 truncate max-w-[140px]">
                        {order.shippingAddress?.city}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <img src={item.image} alt={item.title} className="w-6 h-6 rounded-md object-cover bg-stone-100 shrink-0" />
                            <span className="text-stone-700 truncate max-w-[130px]">{item.title} ({item.size}) x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#1b5e3f]">
                      Rs. {order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {order.paymentSlip ? (
                        <button
                          onClick={() => setSelectedSlip({ id: order._id, img: order.paymentSlip, customer: order.customer?.name || 'Customer' })}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 hover:bg-[#1b5e3f] hover:text-white text-stone-800 rounded-lg text-[11px] font-semibold transition border border-stone-200"
                        >
                          <Eye size={13} />
                          <span>View Slip</span>
                        </button>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">No Slip</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div>{getPaymentBadge(order.paymentStatus || 'Pending Verification')}</div>
                        <select
                          disabled={updatingId === order._id}
                          value={order.paymentStatus || 'Pending Verification'}
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                          className="text-[11px] font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-[#1b5e3f]"
                        >
                          <option value="Pending Verification">Pending</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div>{getStatusBadge(order.status)}</div>
                        <select
                          disabled={updatingId === order._id}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="text-[11px] font-medium bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:border-[#1b5e3f]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slip Preview Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Deposit Receipt Preview
                </h3>
                <p className="text-[11px] text-stone-500">Order from: {selectedSlip.customer}</p>
              </div>
              <button
                onClick={() => setSelectedSlip(null)}
                className="text-stone-400 hover:text-stone-700 transition p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="my-4 flex-1 flex justify-center items-center overflow-auto bg-stone-100 rounded-xl p-2 border border-stone-200">
              <img
                src={selectedSlip.img}
                alt="Bank Payment Slip"
                className="rounded-lg object-contain max-h-[60vh] w-auto shadow-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <a
                href={selectedSlip.img}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                <ExternalLink size={13} />
                <span>Open in Tab</span>
              </a>
              <a
                href={selectedSlip.img}
                download={`slip-${selectedSlip.id}.png`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1b5e3f] hover:bg-[#14472f] text-white text-xs font-semibold rounded-xl transition"
              >
                <Download size={13} />
                <span>Download Slip</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};