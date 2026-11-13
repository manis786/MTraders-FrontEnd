import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  Package, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const OrderScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Fetch Order Details from Backend
  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await apiClient(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handle Customer Self-Cancellation ("Change of Mind")
  const cancelOrderHandler = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      await apiClient(`/orders/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason: 'Customer Change of Mind' }),
      });
      fetchOrder(); // Refresh order state after cancellation
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brandOrange" size={48} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="mx-auto text-red-500" size={48} />
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-gray-400 text-sm">{error || 'Could not retrieve order details.'}</p>
        <Link to="/" className="inline-block bg-brandOrange text-white px-6 py-2.5 rounded-xl font-bold text-sm">
          Back to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium">
          <ArrowLeft size={18} />
          <span>Back to Store</span>
        </Link>
        <span className="text-xs font-mono text-gray-400">Order ID: {order._id}</span>
      </div>

      {/* Order Status Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl ${
        order.status === 'Cancelled' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
        order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
        'bg-brandOrange/10 border-brandOrange/30 text-brandOrange'
      }`}>
        <div className="flex items-center space-x-4">
          {order.status === 'Cancelled' ? <XCircle size={32} /> :
           order.status === 'Delivered' ? <CheckCircle2 size={32} /> :
           <Clock size={32} />}
          <div>
            <h1 className="text-xl font-black text-white">Status: {order.status}</h1>
            <p className="text-xs text-gray-300 mt-0.5">
              {order.status === 'Pending Approval' && 'Your order has been placed and is awaiting store verification.'}
              {order.status === 'Confirmed' && 'Your order is confirmed and being prepared.'}
              {order.status === 'Out for Delivery' && 'Your order is on the way with our delivery partner.'}
              {order.status === 'Delivered' && 'Your order has been successfully delivered.'}
              {order.status === 'Cancelled' && `Order cancelled. Reason: ${order.cancellationReason || 'N/A'}`}
            </p>
          </div>
        </div>

        {/* Self-Cancellation Button */}
        {(order.status === 'Pending Approval' || order.status === 'Confirmed') && (
          <button
            onClick={cancelOrderHandler}
            disabled={cancelling}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-md flex items-center space-x-1.5 shrink-0"
          >
            {cancelling ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
            <span>Cancel Order</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Shipping, Payment & Items (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Shipping Address Details */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Truck className="text-brandOrange" size={20} />
              <span>Shipping Information</span>
            </h2>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Phone:</span> {order.shippingAddress.phone}
            </p>
            {order.shippingDetails?.trackingNumber && (
              <div className="pt-2 border-t border-gray-800 text-xs text-gray-300 space-y-1">
                <p><span className="text-gray-400">Courier:</span> {order.shippingDetails.courierName}</p>
                <p><span className="text-gray-400">Tracking #:</span> <span className="font-mono text-brandOrange">{order.shippingDetails.trackingNumber}</span></p>
              </div>
            )}
          </div>

          {/* Payment Method Details */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <CreditCard className="text-brandOrange" size={20} />
              <span>Payment Method</span>
            </h2>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Method:</span> <span className="text-brandOrange font-bold">{order.paymentMethod}</span>
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-gray-800 pb-3">
              <Package className="text-brandOrange" size={20} />
              <span>Items Ordered</span>
            </h2>
            <div className="divide-y divide-gray-800">
              {order.orderItems.map((item, index) => (
                <div key={index} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-800 bg-charcoal-dark" />
                    <div>
                      <Link to={`/product/${item.product}`} className="text-white font-medium hover:text-brandOrange text-sm line-clamp-1">
                        {item.name}
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

        {/* Right Side: Summary Card (4 Cols) */}
        <div className="lg:col-span-4">
          <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 sticky top-6">
            <h2 className="text-xl font-black text-white border-b border-gray-800 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Items:</span>
                <span className="text-white font-bold">PKR {order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping:</span>
                <span className="text-white font-bold">
                  {order.shippingPrice === 0 ? 'FREE' : `PKR ${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax:</span>
                <span className="text-white font-bold">PKR {order.taxPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-4 border-t border-gray-800">
                <span>Total:</span>
                <span className="text-brandOrange">PKR {order.totalPrice?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};