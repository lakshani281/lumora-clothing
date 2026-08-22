import React, { useState, useEffect } from 'react';
import { Star, Heart } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

export interface ProductType {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  fabric?: string;
  rating?: number;
  reviewsCount?: number;
}

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const { addToCart } = useCart();

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const fabrics = ['100% Cotton', 'Cotton Blend', 'Performance', 'Linen'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        console.log('--- DATABASE PRODUCTS FETCHED ---', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching live products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric) ? prev.filter((f) => f !== fabric) : [...prev, fabric]
    );
  };

  const handleAddToCart = (product: ProductType, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/cat-men.jpg',
      size: product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M',
      color: product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard',
      quantity: 1,
    });
  };

  // Safe & Category-matched Filter Logic
  const filteredProducts = products.filter((product) => {
    // 1. Category Check
    if (selectedCategory !== 'all') {
      const prodCat = (product.category || '').toLowerCase().trim();
      const selected = selectedCategory.toLowerCase().trim();

      // Check if matches or if "men" matches general tops
      const matchesCategory = 
        prodCat === selected ||
        prodCat.includes(selected) ||
        selected.includes(prodCat);

      if (!matchesCategory) return false;
    }

    // 2. Price Check
    if (product.price && product.price > priceRange) {
      return false;
    }

    // 3. Fabric Check
    if (selectedFabrics.length > 0 && product.fabric && !selectedFabrics.includes(product.fabric)) {
      return false;
    }

    // 4. Size Check
    if (selectedSizes.length > 0 && product.sizes && !product.sizes.some((s) => selectedSizes.includes(s))) {
      return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'top-rated') return (b.rating || 5) - (a.rating || 5);
    return 0;
  });

  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">
      <div className="relative bg-stone-900 text-white h-48 md:h-56 flex items-center overflow-hidden">
        <img
          src="/images/cat-men.jpg"
          alt="Lumora Collection Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2 block">
            LUMORA COLLECTION
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide">
            T-Shirts Designed for Every Style
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'men', label: 'Men' },
              { id: 'women', label: 'Women' },
              { id: 'kids', label: 'Kids' },
              { id: 'custom', label: 'Custom' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#1b5e3f] text-white shadow-xs'
                    : 'bg-[#f0eae1] text-stone-800 hover:bg-stone-300/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="self-end md:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f0eae1] border-none text-stone-800 text-xs font-semibold px-5 py-2.5 rounded-2xl focus:outline-none cursor-pointer shadow-xs"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="top-rated">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-8 pr-2">
            <h3 className="font-serif font-bold text-gray-900 text-lg">Filters</h3>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">PRICE RANGE</h4>
              <input
                type="range"
                min="500"
                max="50000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#1b5e3f] cursor-pointer"
              />
              <div className="flex justify-between text-xs font-medium text-stone-600 mt-2">
                <span>Rs. 500</span>
                <span>Rs. {priceRange.toLocaleString()}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">SIZE</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isSelected = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-9 h-9 rounded-2xl text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-[#1b5e3f] text-white border-[#1b5e3f]'
                          : 'bg-[#f0eae1] border-transparent text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">FABRIC</h4>
              <div className="space-y-2.5">
                {fabrics.map((fabric) => (
                  <label key={fabric} className="flex items-center space-x-3 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(fabric)}
                      onChange={() => toggleFabric(fabric)}
                      className="rounded-xs border-stone-300 text-[#1b5e3f] focus:ring-0"
                    />
                    <span>{fabric}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-20 text-stone-500 font-medium">Loading products from database...</div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-stone-500 font-medium">No products found matching the criteria.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => {
                  const isActive = activeProductId === product._id;

                  return (
                    <div
                      key={product._id}
                      onClick={() => setActiveProductId(isActive ? null : product._id)}
                      className="bg-white rounded-2xl overflow-hidden shadow-xs border border-stone-200/60 flex flex-col justify-between group cursor-pointer hover:shadow-md transition duration-300 relative"
                    >
                      <div className="relative h-96 overflow-hidden bg-stone-100">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : '/images/cat-men.jpg'}
                          alt={product.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Added ${product.title} to wishlist!`);
                          }}
                          className="absolute top-3 right-3 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-stone-700 shadow-xs transition"
                        >
                          <Heart size={18} />
                        </button>

                        <div
                          className={`absolute inset-x-0 bottom-4 px-4 transition-all duration-300 ${
                            isActive ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 translate-y-2'
                          }`}
                        >
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            className="w-full bg-[#1b5e3f] hover:bg-[#14472f] text-white font-medium py-3 rounded-xl text-xs transition shadow-md"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-stone-900 text-sm mb-1">{product.title}</h3>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(product.rating || 5)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                          ))}
                          <span className="text-[11px] text-stone-400 ml-1">
                            ({product.reviewsCount || 1})
                          </span>
                        </div>
                        <p className="text-[#1b5e3f] font-bold text-sm">
                          Rs. {product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};