import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  Search, 
  PackageX, 
  Loader2, 
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Navbar search bar se query string get karne ke liye
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const query = keyword ? `?keyword=${encodeURIComponent(keyword)}` : '';
        const data = await apiClient(`/products${query}`);
        setProducts(data.products || data);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner / Header */}
      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-brandOrange text-xs font-extrabold uppercase tracking-widest bg-brandOrange/10 px-3 py-1 rounded-full border border-brandOrange/20">
            Tradition of Trust
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-3">
            Explore Premium Products at <span className="text-brandOrange">Memon Traders</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Top-quality items delivered straight to your door with real-time order tracking.
          </p>
        </div>
        {/* Background glow effect */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-brandOrange/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active Search Title / Filter Indicator */}
      {keyword && (
        <div className="flex items-center justify-between bg-charcoal/50 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-300 text-sm">
            Showing results for: <span className="text-brandOrange font-bold">"{keyword}"</span>
          </p>
          <span className="text-xs text-gray-400">
            Found {products.length} item(s)
          </span>
        </div>
      )}

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Loading catalog...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-xs bg-red-600/20 px-3 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition"
          >
            Try Again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl p-12 text-center space-y-4">
          <PackageX className="w-16 h-16 text-gray-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Products Found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            {keyword 
              ? `We couldn't find any items matching "${keyword}". Try searching with another term.`
              : 'No products are currently available in the catalog.'}
          </p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-charcoal border border-charcoal-light rounded-xl overflow-hidden hover:border-brandOrange/50 transition-all duration-300 flex flex-col group shadow-lg"
            >
              {/* Image Container */}
              <Link to={`/product/${product._id}`} className="relative h-48 bg-charcoal-dark overflow-hidden block">
                <img 
                  src={product.image || 'https://via.placeholder.com/300?text=No+Image'} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.countInStock <= 0 && (
                  <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-widest border border-red-500/40 px-3 py-1 rounded bg-red-500/10">
                      Out of Stock
                    </span>
                  </div>
                )}
              </Link>

              {/* Info Container */}
              <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-end text-xs text-gray-400 mb-1">
                    {product.countInStock > 0 ? (
                      <span className="flex items-center text-green-400 text-[11px] shrink-0">
                        <CheckCircle2 size={12} className="mr-1" /> In Stock
                      </span>
                    ) : null}
                  </div>

                  {/* Product Title */}
                  <Link 
                    to={`/product/${product._id}`}
                    className="text-white font-bold hover:text-brandOrange line-clamp-1 transition text-base block"
                    title={product.title}
                  >
                    {product.title}
                  </Link>

                  <p className="text-gray-400 text-xs line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                {/* Price & View Details Button */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-400 block">Price</span>
                    <span className="text-lg font-black text-white">
                      Rs. {product.price?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/product/${product._id}`}
                    className="bg-brandOrange hover:bg-brandOrange-hover text-white px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-md shadow-brandOrange/20 flex items-center space-x-1.5"
                  >
                    <Eye size={15} />
                    <span>View Details</span>
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};