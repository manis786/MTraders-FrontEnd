import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  Package, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  RefreshCw,
  Check,
  Tag
} from 'lucide-react';

export const ManageProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Track updating state per product ID and temporary input values
  const [updatingId, setUpdatingId] = useState(null);
  const [stockInputs, setStockInputs] = useState({});

  // Fetch all products from database
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient('/products');
      const fetchedProducts = data.products || data || [];
      setProducts(fetchedProducts);
      
      // Initialize stock inputs state with current stock values
      const initialInputs = {};
      fetchedProducts.forEach(p => {
        initialInputs[p._id] = p.countInStock !== undefined ? p.countInStock : (p.stock || 0);
      });
      setStockInputs(initialInputs);
    } catch (err) {
      setError(err.message || 'Failed to fetch products from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Input Change for a specific product
  const handleInputChange = (productId, value) => {
    setStockInputs(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  // Update Product Stock Quantity in Database
  const handleUpdateStock = async (productId) => {
    const newStock = parseInt(stockInputs[productId], 10);
    
    if (isNaN(newStock) || newStock < 0) {
      alert('Please enter a valid stock quantity (0 or more)!');
      return;
    }

    setUpdatingId(productId);
    try {
      await apiClient(`/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ countInStock: newStock }),
      });

      // Update local state
      setProducts(products.map(p => p._id === productId ? { ...p, countInStock: newStock, stock: newStock } : p));
      alert('Stock quantity updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update stock quantity');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12 relative">
      
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <div>
          <Link 
            to="/admin" 
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-black text-white">
            Manage <span className="text-brandOrange">Products Grid</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            View all store items in a visual grid and update stock quantities instantly.
          </p>
        </div>

        <button 
          onClick={fetchProducts}
          className="flex items-center space-x-2 bg-charcoal-dark hover:bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-brandOrange' : ''} />
          <span>Refresh Products</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading store inventory grid...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle size={22} />
            <span className="font-semibold">{error}</span>
          </div>
          <button 
            onClick={fetchProducts}
            className="text-xs bg-red-600/20 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl p-16 text-center space-y-4">
          <Package className="w-16 h-16 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Products Found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Store mein koi products available nahi hain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const currentStock = product.countInStock !== undefined ? product.countInStock : (product.stock || 0);
            const isOutOfStock = currentStock === 0;
            const isUpdating = updatingId === product._id;

            return (
              <div 
                key={product._id} 
                className="bg-charcoal border border-charcoal-light rounded-2xl shadow-xl overflow-hidden flex flex-col justify-between hover:border-gray-700 transition"
              >
                {/* Product Image & Badge */}
                <div className="relative h-48 bg-charcoal-dark overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Package size={40} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-md ${
                      isOutOfStock 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : currentStock < 5
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {isOutOfStock ? 'Out of Stock' : `${currentStock} in stock`}
                    </span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center space-x-1">
                        <Tag size={12} className="text-brandOrange" />
                        <span>{product.category || 'General'}</span>
                      </span>
                      <span className="font-mono text-white font-bold">Rs. {Number(product.price)?.toLocaleString()}</span>
                    </div>

                    <h3 className="text-white font-bold text-base line-clamp-1" title={product.name}>
                      {product.name}
                    </h3>
                  </div>

                  {/* Quantity Modifier Section */}
                  <div className="pt-4 border-t border-gray-800 space-y-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Update Quantity / Stock
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={stockInputs[product._id] !== undefined ? stockInputs[product._id] : currentStock}
                        onChange={(e) => handleInputChange(product._id, e.target.value)}
                        className="w-full bg-charcoal-dark text-white text-xs font-bold rounded-xl px-3 py-2 border border-gray-700 focus:border-brandOrange focus:outline-none transition"
                      />
                      <button
                        onClick={() => handleUpdateStock(product._id)}
                        disabled={isUpdating}
                        className="bg-brandOrange hover:bg-brandOrange-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-brandOrange/20 flex items-center justify-center min-w-[70px] disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};