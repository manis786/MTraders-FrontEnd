import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  ShoppingCart,
  User, 
  LogOut, 
  ShieldAlert, 
  Package, 
  Search, 
  Store,
  X
} from 'lucide-react';

export const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [cartCount, setCartCount] = useState(0);

  // Function to calculate total quantity from localStorage
  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalQty = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    // 1. Initial count on load
    updateCartCount();

    // 2. Listen for custom 'cartUpdated' event
    window.addEventListener('cartUpdated', updateCartCount);

    // 3. Listen for direct localStorage changes across tabs
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/?search=${encodeURIComponent(keyword.trim())}`);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setKeyword('');
    navigate('/');
  };

  return (
    <nav className="bg-charcoal border-b border-charcoal-light sticky top-0 z-50 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* === 1. LEFT SIDE: Brand Logo + Core Links === */}
        <div className="flex items-center space-x-6 shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="text-brandOrange w-7 h-7" />
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-white leading-none">
                MEMON <span className="text-brandOrange">TRADERS</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mt-1">
                Tradition of Trust
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center space-x-5 border-l border-gray-700 pl-5">
            <Link 
              to="/" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-brandOrange font-medium transition text-sm"
            >
              <ShoppingBag size={17} />
              <span>Products</span>
            </Link>

            <Link 
              to="/track-order" 
              className="flex items-center space-x-1.5 text-gray-300 hover:text-brandOrange font-medium transition text-sm"
            >
              <Search size={17} />
              <span>Tracking</span>
            </Link>
          </div>
        </div>

        {/* === 2. CENTER: Product Search Bar === */}
        <div className="flex-grow max-w-md mx-2">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search products by name, category..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-charcoal-dark/80 text-gray-100 placeholder-gray-500 text-sm rounded-full pl-10 pr-9 py-2 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange transition"
            />
            <Search 
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" 
              size={16} 
            />
            {keyword && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </form>
        </div>

        {/* === 3. RIGHT SIDE: Cart & User Controls === */}
        <div className="flex items-center space-x-4 shrink-0">
          {/* Cart Icon with Live Counter Badge */}
          <Link 
            to="/cart" 
            className="relative p-2 text-gray-300 hover:text-brandOrange transition"
            title="Shopping Cart"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brandOrange text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-charcoal shadow-lg">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {userInfo ? (
            <>
              <Link 
                to="/my-orders" 
                className="hidden md:flex items-center space-x-1 text-gray-300 hover:text-brandOrange font-medium transition text-sm"
              >
                <Package size={17} />
                <span>Orders</span>
              </Link>

              <Link 
                to="/profile" 
                className="flex items-center space-x-1 text-gray-300 hover:text-brandOrange font-medium transition text-sm"
              >
                <User size={17} />
                <span>Profile</span>
              </Link>

              {userInfo.isAdmin && (
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-1 text-brandOrange font-semibold bg-brandOrange/10 border border-brandOrange/30 px-2.5 py-1 rounded-lg hover:bg-brandOrange hover:text-white transition text-xs"
                >
                  <ShieldAlert size={16} />
                  <span>Admin</span>
                </Link>
              )}

              <div className="flex items-center space-x-2 pl-2 border-l border-gray-700">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                  <span>Signout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-gray-700">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brandOrange hover:bg-brandOrange-hover text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow-md shadow-brandOrange/20 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};