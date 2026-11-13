import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  ShoppingBag, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  SlidersHorizontal,
  X,
  Truck
} from 'lucide-react';

export const AdminOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  
  // Modal State & Action States
  const [activeModalOrder, setActiveModalOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient('/orders');
      setOrders(data.orders || data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update Delivery Status Dropdown Handler
  const handleDeliveryStatusUpdate = async (orderId, newDeliveryStatus) => {
    setUpdatingId(orderId);
    try {
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ deliveryStatus: newDeliveryStatus }),
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, deliveryStatus: newDeliveryStatus } : o));
    } catch (err) {
      alert(err.message || 'Failed to update delivery status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle Approve from Modal (Set Order Status to 'Confirmed')
  const handleApprove = async (orderId) => {
    setActionLoading(true);
    try {
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Confirmed' }),
      });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Confirmed' } : o));
      setActiveModalOrder(null);
    } catch (err) {
      alert(err.message || 'Failed to approve order');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Reject from Modal (Requires Reason, sets Order Status to 'Cancelled' & restores stock)[cite: 1]
  const handleReject = async (orderId) => {
    if (!rejectReason.trim()) {
      alert('Please enter a cancellation / rejection reason first!');
      return;
    }

    setActionLoading(true);
    try {
      await apiClient(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'Cancelled', cancellationReason: rejectReason }),
      });
      
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'Cancelled', cancellationReason: rejectReason } : o));
      setActiveModalOrder(null);
      setRejectReason('');
    } catch (err) {
      alert(err.message || 'Failed to reject order');
    } finally {
      setActionLoading(false);
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
            Delivery & <span className="text-brandOrange">Orders Management</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Monitor customer purchases, fulfillment status, and delivery milestones.
          </p>
        </div>

        <button 
          onClick={fetchOrders}
          className="flex items-center space-x-2 bg-charcoal-dark hover:bg-gray-800 text-gray-300 border border-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-brandOrange' : ''} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Fetching orders from database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle size={22} />
            <span className="font-semibold">{error}</span>
          </div>
          <button 
            onClick={fetchOrders}
            className="text-xs bg-red-600/20 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl p-16 text-center space-y-4">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Jab customers storefront se koi order place karenge, toh unka record yahan show hoga.
          </p>
        </div>
      ) : (
        <div className="bg-charcoal border border-charcoal-light rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-bold text-white">All Store Orders ({orders.length})</h3>
            <p className="text-xs text-gray-400">Manage fulfillment stages and order status in real-time</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-charcoal-dark text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                  <th className="py-3.5 px-6 font-semibold">Order ID</th>
                  <th className="py-3.5 px-6 font-semibold">Customer</th>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                  <th className="py-3.5 px-6 font-semibold">Total Amount</th>
                  <th className="py-3.5 px-6 font-semibold">Order Status</th>
                  <th className="py-3.5 px-6 font-semibold">Update Delivery Status</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {orders.map((order) => {
                  const orderStatus = order.status || 'Pending Approval';
                  const deliveryStatus = order.deliveryStatus || 'Pending';
                  const isLocked = orderStatus !== 'Pending Approval';

                  return (
                    <tr key={order._id} className={`hover:bg-charcoal-dark/50 transition ${orderStatus === 'Cancelled' ? 'opacity-75 bg-charcoal-dark/30' : ''}`}>
                      <td className="py-4 px-6 font-bold text-white font-mono text-xs">
                        {order._id}
                        {orderStatus === 'Cancelled' && <span className="block text-[10px] text-red-400 font-normal mt-0.5">Reason: {order.cancellationReason || 'Cancelled'}</span>}
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {order.user?.name || order.shippingAddress?.fullName || 'Valued Customer'}
                      </td>
                      <td className="py-4 px-6 text-gray-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-black text-white">
                        Rs. {Number(order.totalPrice)?.toLocaleString()}
                      </td>
                      
                      {/* Column 1: Order Status Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          orderStatus === 'Confirmed' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : orderStatus === 'Cancelled'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {orderStatus}
                        </span>
                      </td>

                      {/* Column 2: Update Delivery Status Dropdown */}
                      <td className="py-4 px-6">
                        <select 
                          value={deliveryStatus}
                          disabled={updatingId === order._id || orderStatus === 'Cancelled'}
                          onChange={(e) => handleDeliveryStatusUpdate(order._id, e.target.value)}
                          className="bg-charcoal-dark text-white text-xs border border-gray-700 rounded-lg px-3 py-1.5 focus:border-brandOrange focus:outline-none transition cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>

                      {/* Column 3: Review Action Button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            if (isLocked) return;
                            setActiveModalOrder(order);
                            setRejectReason('');
                          }}
                          disabled={isLocked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition inline-flex items-center space-x-1.5 ${
                            isLocked 
                              ? 'bg-gray-800/40 text-gray-500 border border-gray-800 cursor-not-allowed' 
                              : 'bg-brandOrange/10 hover:bg-brandOrange text-brandOrange hover:text-white border border-brandOrange/30'
                          }`}
                        >
                          <SlidersHorizontal size={14} />
                          <span>{orderStatus}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= ACTION MODAL WINDOW ================= */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-charcoal border border-charcoal-light w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-charcoal-dark">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Truck size={18} className="text-brandOrange" />
                  <span>Order Review & Action Window</span>
                </h3>
                <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {activeModalOrder._id}</p>
              </div>
              <button 
                onClick={() => setActiveModalOrder(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              
              {/* Order Quick Info */}
              <div className="bg-charcoal-dark p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white font-bold">Rs. {activeModalOrder.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment Method:</span>
                  <span className="text-brandOrange font-bold">{activeModalOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order Status:</span>
                  <span className="text-yellow-400 font-bold">{activeModalOrder.status || 'Pending Approval'}</span>
                </div>
                {activeModalOrder.shippingAddress && (
                  <div className="pt-2 border-t border-gray-800 text-gray-300">
                    <span className="text-gray-400 block mb-0.5">Shipping Address:</span>
                    {activeModalOrder.shippingAddress.address}, {activeModalOrder.shippingAddress.city} (Phone: {activeModalOrder.shippingAddress.phone})
                  </div>
                )}
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ordered Items</label>
                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 divide-y divide-gray-800">
                  {activeModalOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-center text-xs text-gray-300">
                      <span>{item.name} (x{item.qty})</span>
                      <span className="font-bold text-white">Rs. {(item.qty * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rejection / Cancellation Reason Input */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Rejection Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows="2"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Type reason here (Required only if rejecting this order)..."
                  className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-red-500 focus:outline-none text-xs transition resize-none"
                />
                <p className="text-[11px] text-gray-500">
                  * Note: Approving sets Order Status to Confirmed. Rejecting requires typing a reason and will restore items back to inventory stock[cite: 1].
                </p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-800 bg-charcoal-dark">
              <button
                onClick={() => handleReject(activeModalOrder._id)}
                disabled={actionLoading || !rejectReason.trim()}
                className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                <span>Reject Order</span>
              </button>

              <button
                onClick={() => handleApprove(activeModalOrder._id)}
                disabled={actionLoading}
                className="bg-brandOrange hover:bg-brandOrange-hover text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg shadow-brandOrange/20 flex items-center space-x-1.5"
              >
                {actionLoading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                <span>Approve Order</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};