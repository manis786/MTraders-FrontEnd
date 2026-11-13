import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  MapPin
} from 'lucide-react';

export const TrackOrderScreen = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch order if ID is present in URL on mount
  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrderDetails = async (idToFetch) => {
    const targetId = idToFetch || orderIdInput;
    if (!targetId.trim()) {
      alert('Please enter a valid Order ID!');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await apiClient(`/orders/${targetId.trim()}`);
      setOrder(data.order || data);
    } catch (err) {
      setError(err.message || 'Order not found. Please check your Order ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrderDetails(orderIdInput);
  };

  // Safely compute or retrieve financial breakdown fields
  const itemsPrice = order?.itemsPrice || order?.orderItems?.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty || item.quantity || 1)), 0) || 0;
  const shippingPrice = order?.shippingPrice !== undefined ? Number(order.shippingPrice) : 0;
  const taxPrice = order?.taxPrice !== undefined ? Number(order.taxPrice) : 0;
  const discountAmount = order?.discount !== undefined ? Number(order.discount) : (order?.discountPrice !== undefined ? Number(order.discountPrice) : 0);
  const totalPrice = order?.totalPrice !== undefined ? Number(order.totalPrice) : (itemsPrice + shippingPrice + taxPrice - discountAmount);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 pt-4">
      
      {/* Header Banner */}
      <div className="bg-charcoal border border-charcoal-light p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white mb-3 transition">
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </Link>
          <span className="text-brandOrange text-xs font-extrabold uppercase tracking-widest bg-brandOrange/10 px-3 py-1 rounded-full border border-brandOrange/20 block w-max mt-2">
            Memon Traders Live Tracking
          </span>
          <h1 className="text-3xl font-black text-white mt-2">
            Track Your <span className="text-brandOrange">Order Status</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter your order ID below to monitor live approval, fulfillment, and complete financial breakdown.
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Enter MongoDB Order ID (e.g. 6af7864e41e235737d3ecfc3)"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full bg-charcoal-dark text-white rounded-xl pl-11 pr-4 py-3.5 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-brandOrange hover:bg-brandOrange-hover text-white font-bold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-brandOrange/20 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            <span>Track Order</span>
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Fetching order tracking details from database...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl flex items-center space-x-3">
          <AlertCircle size={24} />
          <div>
            <h4 className="font-bold text-base">Tracking Failed</h4>
            <p className="text-xs text-gray-300 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Order Details Result */}
      {order && !loading && (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl shadow-xl overflow-hidden space-y-6 p-8">
          
          {/* Order ID & Status Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-800">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider block">Order Reference ID</span>
              <h3 className="text-white font-mono font-bold text-lg mt-0.5">{order._id}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.orderStatus === 'Confirmed' 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : order.orderStatus === 'Rejected'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
              }`}>
                Order: {order.orderStatus || 'Pending Approval'}
              </span>

              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.deliveryStatus === 'Delivered'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : order.deliveryStatus === 'Dispatched'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-800 text-gray-300 border border-gray-700'
              }`}>
                Delivery: {order.deliveryStatus || 'Processing'}
              </span>
            </div>
          </div>

          {/* Rejection Reason Notice */}
          {order.orderStatus === 'Rejected' && order.rejectionReason && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-xs space-y-1">
              <span className="font-bold block">Order Rejected Reason:</span>
              <p className="text-gray-300">{order.rejectionReason}</p>
            </div>
          )}

          {/* Visual Timeline / Status Steps */}
          <div className="py-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Fulfillment Progress</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
                order.orderStatus !== 'Rejected' ? 'bg-brandOrange/10 border-brandOrange/30 text-white' : 'bg-charcoal-dark border-gray-800 text-gray-500'
              }`}>
                <Clock className={order.orderStatus !== 'Rejected' ? 'text-brandOrange' : 'text-gray-600'} size={22} />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Step 1</span>
                  <span className="text-xs font-bold">Order Received</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
                order.orderStatus === 'Confirmed' ? 'bg-green-500/10 border-green-500/30 text-white' : order.orderStatus === 'Rejected' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-charcoal-dark border-gray-800 text-gray-500'
              }`}>
                {order.orderStatus === 'Confirmed' ? <CheckCircle2 className="text-green-400" size={22} /> : order.orderStatus === 'Rejected' ? <XCircle className="text-red-400" size={22} /> : <Clock size={22} />}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Step 2</span>
                  <span className="text-xs font-bold">{order.orderStatus === 'Rejected' ? 'Rejected' : 'Admin Confirmed'}</span>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
                order.deliveryStatus === 'Delivered' ? 'bg-green-500/10 border-green-500/30 text-white' : order.deliveryStatus === 'Dispatched' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-charcoal-dark border-gray-800 text-gray-500'
              }`}>
                <Truck size={22} />
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-400 block">Step 3</span>
                  <span className="text-xs font-bold">{order.deliveryStatus || 'Processing Dispatch'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Ordered Items</h4>
            <div className="bg-charcoal-dark rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-900 text-gray-400 border-b border-gray-800">
                    <th className="py-3 px-4 font-semibold">Item Name</th>
                    <th className="py-3 px-4 font-semibold text-center">Quantity</th>
                    <th className="py-3 px-4 font-semibold text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {order.orderItems?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                        <Package size={14} className="text-brandOrange" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-300 font-semibold">{item.qty || item.quantity}</td>
                      <td className="py-3 px-4 text-right font-black text-white">Rs. {Number(item.price)?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Address & Detailed Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800 items-start">
            
            {/* Shipping Address */}
            <div className="space-y-2 bg-charcoal-dark p-5 rounded-xl border border-gray-800">
              <span className="text-xs text-gray-400 flex items-center space-x-1.5 font-bold uppercase">
                <MapPin size={16} className="text-brandOrange" />
                <span>Shipping Address</span>
              </span>
              <p className="text-white text-sm font-medium leading-relaxed">
                {order.shippingAddress?.address || 'N/A'}, {order.shippingAddress?.city || ''}
              </p>
              {order.shippingAddress?.postalCode && (
                <p className="text-xs text-gray-400">Postal Code: {order.shippingAddress.postalCode}</p>
              )}
            </div>

            {/* Financial Summary Breakdown Card */}
            <div className="bg-charcoal-dark p-5 rounded-xl border border-gray-800 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>Gross Amount (Items Subtotal):</span>
                <span className="font-bold text-white">Rs. {itemsPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span>Shipping Fee:</span>
                <span className="font-bold text-white">Rs. {shippingPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span>Taxes / GST:</span>
                <span className="font-bold text-white">Rs. {taxPrice.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-400">
                  <span>Discount Amount:</span>
                  <span className="font-bold">- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-700 flex items-center justify-between">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Total Bill Amount:</span>
                <span className="text-xl font-black text-brandOrange">
                  Rs. {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};