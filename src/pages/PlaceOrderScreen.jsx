import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  CheckCircle, 
  Truck, 
  CreditCard, 
  ShoppingBag, 
  ArrowLeft, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

export const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  // Retrieve saved state from localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = JSON.parse(localStorage.getItem('paymentMethod')) || 'Cash on Delivery';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Price Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 ? 0 : 250; // Free shipping above PKR 5000
  const taxPrice = Number((0.02 * itemsPrice).toFixed(0)); // 2% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    setError('');
    setLoading(true);

    try {
      // Map items to backend order format
      const formattedItems = cartItems.map((item) => ({
        name: item.title,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product,
      }));

      const payload = {
        orderItems: formattedItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const createdOrder = await apiClient('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Clear Cart from localStorage
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));

      // Redirect to Order Confirmation / Details Page
      navigate(`/order/${createdOrder._id || createdOrder.id}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <Link 
          to="/payment" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Payment</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-brandOrange font-bold bg-brandOrange/10 border border-brandOrange/20 px-3 py-1 rounded-full">
          Step 3: Review & Place Order
        </span>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Order Information (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Truck className="text-brandOrange" size={20} />
              <span>Shipping Address</span>
            </h2>
            <p className="text-gray-300 text-sm font-medium pt-2">
              <span className="text-gray-400">Address:</span> {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode}
            </p>
            <p className="text-gray-300 text-sm font-medium">
              <span className="text-gray-400">Phone:</span> {shippingAddress.phone}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-2">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <CreditCard className="text-brandOrange" size={20} />
              <span>Payment Method</span>
            </h2>
            <p className="text-gray-300 text-sm font-medium pt-2">
              <span className="text-gray-400">Method:</span> <span className="text-brandOrange font-bold">{paymentMethod}</span>
            </p>
          </div>

          {/* Cart Items Summary */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <ShoppingBag className="text-brandOrange" size={20} />
              <span>Ordered Items ({cartItems.length})</span>
            </h2>

            <div className="divide-y divide-gray-800">
              {cartItems.map((item) => (
                <div key={item.product} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-gray-800 bg-charcoal-dark" />
                    <div>
                      <Link to={`/product/${item.product}`} className="text-white font-medium hover:text-brandOrange text-sm line-clamp-1">
                        {item.title}
                      </Link>
                      <p className="text-xs text-gray-400">
                        {item.qty} x PKR {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-white font-bold text-sm">
                    PKR {(item.qty * item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Price Breakdown Card (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-6">
            <h2 className="text-xl font-black text-white border-b border-gray-800 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Items Total:</span>
                <span className="text-white font-bold">PKR {itemsPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping Fee:</span>
                <span className={shippingPrice === 0 ? "text-green-400 font-bold" : "text-white font-bold"}>
                  {shippingPrice === 0 ? 'FREE' : `PKR ${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax (2%):</span>
                <span className="text-white font-bold">PKR {taxPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-lg font-black text-white pt-4 border-t border-gray-800">
                <span>Total Amount:</span>
                <span className="text-brandOrange">PKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={placeOrderHandler}
              disabled={loading || cartItems.length === 0}
              className="w-full bg-brandOrange hover:bg-brandOrange-hover disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brandOrange/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};