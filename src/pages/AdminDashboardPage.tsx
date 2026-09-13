import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Package, ShoppingBag, Layers, RefreshCw, ShoppingCart, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import API from '../services/api';
import { AdminOrders } from '../components/AdminOrders';

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  fabric?: string;
  images?: string[];
}

export const AdminDashboardPage: React.FC = () => {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'orders'>('products');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'men',
    fabric: '100% Cotton',
    stock: '',
    sizes: ['S', 'M', 'L', 'XL'],
  });

  // Product Image Upload State (Base64)
  const [productImage, setProductImage] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setProductImage('');
    setFileName('');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      await API.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert('Product deleted successfully');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete product. Ensure you are logged in as Admin.');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!productImage) {
      setMessage({ type: 'error', text: 'Please select an image for the product.' });
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem('lumora_token') || localStorage.getItem('token');
      const payload = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        fabric: formData.fabric,
        stock: Number(formData.stock) || 10,
        images: [productImage],
        sizes: formData.sizes,
      };

      await API.post('/products', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: 'success', text: 'Product published successfully!' });
      setFormData({
        title: '',
        description: '',
        price: '',
        category: 'men',
        fabric: '100% Cotton',
        stock: '',
        sizes: ['S', 'M', 'L', 'XL'],
      });
      setProductImage('');
      setFileName('');
      fetchProducts();
      setActiveTab('products');
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error creating product. Please verify Admin token.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf8f5] min-h-screen py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#1b5e3f] font-bold block mb-1">
              MANAGEMENT PORTAL
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1b5e3f] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Package size={15} /> All Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#1b5e3f] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <ShoppingCart size={15} /> Customer Orders
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                activeTab === 'add-product'
                  ? 'bg-[#1b5e3f] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Plus size={15} /> Add Product
            </button>
          </div>
        </div>

        {/* Tab 1: Product List */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <h2 className="font-semibold text-stone-800 text-sm flex items-center gap-2">
                <Layers size={16} className="text-[#1b5e3f]" /> Live Inventory
              </h2>
              <button
                onClick={fetchProducts}
                className="text-stone-500 hover:text-[#1b5e3f] text-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-16 text-center text-stone-400 text-sm">Loading inventory...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center text-stone-400 text-sm">No products in database yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100">
                    <tr>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Fabric</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {products.map((item) => (
                      <tr key={item._id} className="hover:bg-stone-50/60 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={item.images?.[0] || '/images/cat-men.jpg'}
                            alt={item.title}
                            className="w-10 h-10 object-cover rounded-lg bg-stone-100 border border-stone-200"
                          />
                          <span className="font-semibold text-stone-900 line-clamp-1">{item.title}</span>
                        </td>
                        <td className="px-6 py-4 capitalize text-stone-600">{item.category}</td>
                        <td className="px-6 py-4 text-stone-500">{item.fabric || 'Cotton'}</td>
                        <td className="px-6 py-4 text-[#1b5e3f] font-bold">Rs. {item.price.toLocaleString()}</td>
                        <td className="px-6 py-4">{item.stock || 10}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Customer Orders Table */}
        {activeTab === 'orders' && <AdminOrders />}

        {/* Tab 3: Add New Product Form */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 md:p-8 shadow-xs max-w-2xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">Create New T-Shirt Listing</h2>
            <p className="text-xs text-stone-500 mb-6">Fill in the product details and select an image to publish to the catalog.</p>

            {message && (
              <div
                className={`p-3.5 mb-6 rounded-xl text-xs font-semibold ${
                  message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Classic Cotton Crew Neck"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Comfortable daily wear breathable t-shirt..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Price (LKR)</label>
                  <input
                    type="number"
                    required
                    placeholder="2800"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Initial Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1.5">Fabric Material</label>
                  <select
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#1b5e3f]"
                  >
                    <option value="100% Cotton">100% Cotton</option>
                    <option value="Cotton Blend">Cotton Blend</option>
                    <option value="Performance">Performance</option>
                    <option value="Linen">Linen</option>
                  </select>
                </div>
              </div>

              {/* Direct Image Upload Box with Preview */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1.5">
                  Product Image <span className="text-red-500">*</span>
                </label>

                {productImage ? (
                  <div className="relative border border-stone-200 rounded-2xl p-3 bg-stone-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={productImage}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-xl border border-stone-200 shadow-2xs"
                      />
                      <div>
                        <p className="font-semibold text-stone-800 text-xs truncate max-w-[200px]">
                          {fileName || 'Product Image Selected'}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          ✓ Ready to publish
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Remove image"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-stone-300 hover:border-[#1b5e3f] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-stone-50/50 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                    <UploadCloud size={26} className="text-stone-400 group-hover:text-[#1b5e3f] transition mb-2" />
                    <p className="text-xs font-semibold text-stone-700">Click to select product image</p>
                    <p className="text-[10px] text-stone-400 mt-1">PNG, JPG or WebP (Max 5MB)</p>
                  </label>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !productImage}
                className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white font-semibold py-3 rounded-xl transition shadow-xs mt-4 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? 'Publishing Product...' : 'Publish Product to Catalog'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};