import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBag, 
  Plus, 
  Minus 
} from 'lucide-react';

export const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart items from localStorage on mount
  useEffect(() => {
    const existingCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(existingCart);
  }, []);

  // Remove item from cart and notify Navbar
  const removeFromCartHandler = (id) => {
    const updatedCart = cartItems.filter((x) => x.product !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Update quantity handler and notify Navbar
  const updateQtyHandler = (item, newQty) => {
    if (newQty < 1 || newQty > item.countInStock) return;
    const updatedCart = cartItems.map((x) =>
      x.product === item.product ? { ...x, qty: newQty } : x
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Proceed to Checkout handler
  const checkoutHandler = () => {
    navigate('/shipping');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-3">
          <ShoppingCart className="text-brandOrange" size={32} />
          <span>Shopping <span className="text-brandOrange">Cart</span></span>
        </h1>
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium">
          <ArrowLeft size={18} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl p-12 text-center space-y-4 shadow-2xl">
          <ShoppingBag className="mx-auto text-gray-600" size={64} />
          <h2 className="text-xl font-bold text-white">Your cart is empty</h2>
          <p className="text-gray-400 text-sm">Looks like you haven't added anything to your cart yet.</p>
          <Link 
            to="/" 
            className="inline-block bg-brandOrange hover:bg-brandOrange-hover text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brandOrange/20 transition"
          >
            Start Shopping Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cart Items List (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.product}
                className="bg-charcoal border border-charcoal-light rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
              >
                {/* Product Image & Title */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-charcoal-dark border border-gray-800 shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <Link to={`/product/${item.product}`} className="text-white font-bold hover:text-brandOrange transition text-sm sm:text-base line-clamp-1">
                      {item.title}
                    </Link>
                    <p className="text-brandOrange font-black text-sm">PKR {item.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                  {/* Quantity Select */}
                  <div className="flex items-center space-x-2 bg-charcoal-dark border border-gray-700 rounded-xl px-3 py-1.5">
                    <button 
                      onClick={() => updateQtyHandler(item, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-bold text-sm w-6 text-center">{item.qty}</span>
                    <button 
                      onClick={() => updateQtyHandler(item, item.qty + 1)}
                      disabled={item.qty >= item.countInStock}
                      className="text-gray-400 hover:text-white disabled:opacity-30"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCartHandler(item.product)}
                    className="text-gray-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition"
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Card (4 Cols) */}
          <div className="lg:col-span-4">
            <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-6">
              <h2 className="text-xl font-black text-white border-b border-gray-800 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Total Items:</span>
                  <span className="text-white font-bold">
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)} Units
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Shipping:</span>
                  <span className="text-green-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-black text-white pt-3 border-t border-gray-800">
                  <span>Subtotal:</span>
                  <span className="text-brandOrange">PKR {subtotal.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={checkoutHandler}
                className="w-full bg-brandOrange hover:bg-brandOrange-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brandOrange/20 transition flex items-center justify-center space-x-2 text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};