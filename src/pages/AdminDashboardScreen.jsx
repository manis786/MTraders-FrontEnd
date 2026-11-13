import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  PlusCircle, 
  FileText, 
  Loader2,
  AlertCircle,
  PackageX,
  RefreshCw,
  Truck,
  Layers,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const AdminDashboardScreen = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Real APIs se data fetch karne ka function (using relative paths as per apiClient config)
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Products
      const productsRes = await apiClient('/products');
      const fetchedProducts = productsRes.products || productsRes || [];
      setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);

      // 2. Fetch Orders (Safety Fallback)
      try {
        const ordersRes = await apiClient('/orders');
        const fetchedOrders = ordersRes.orders || ordersRes || [];
        setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
      } catch (err) {
        setOrders([]);
      }

      // 3. Fetch Expenses (Safety Fallback)
      try {
        const expensesRes = await apiClient('/expenses');
        const fetchedExpenses = expensesRes.expenses || expensesRes || [];
        setExpenses(Array.isArray(fetchedExpenses) ? fetchedExpenses : []);
      } catch (err) {
        setExpenses([]);
      }

    } catch (err) {
      setError(err.message || 'Failed to connect with backend database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Real-time calculated metrics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => Number(p.countInStock) <= 3);
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

  // Prepare Chart Data from Orders (Group by Date)
  const chartDataMap = {};
  orders.forEach(order => {
    const dateStr = new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!chartDataMap[dateStr]) {
      chartDataMap[dateStr] = { date: dateStr, sales: 0, ordersCount: 0 };
    }
    chartDataMap[dateStr].sales += Number(order.totalPrice) || 0;
    chartDataMap[dateStr].ordersCount += 1;
  });

  const chartData = Object.values(chartDataMap);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-brandOrange text-xs font-extrabold uppercase tracking-widest bg-brandOrange/10 px-3 py-1 rounded-full border border-brandOrange/20">
            Live MongoDB API & Analytics Mode
          </span>
          <h1 className="text-3xl font-black text-white mt-2">
            Admin <span className="text-brandOrange">Control Center</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time product inventory, order processing, and visual sales analytics.
          </p>
        </div>

        {/* Action Buttons including Manage Orders & Manage Products Grid */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={fetchDashboardData}
            className="p-2.5 bg-charcoal-dark hover:bg-gray-800 text-gray-300 border border-gray-700 rounded-xl transition"
            title="Refresh Database Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin text-brandOrange' : ''} />
          </button>

          <Link 
            to="/admin/orders"
            className="flex items-center space-x-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 px-4 py-2.5 rounded-xl font-bold text-sm transition"
          >
            <Truck size={18} />
            <span>Manage Orders</span>
          </Link>

          {/* Manage Products Grid Button */}
          <Link 
            to="/admin/products"
            className="flex items-center space-x-2 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 px-4 py-2.5 rounded-xl font-bold text-sm transition"
          >
            <Layers size={18} />
            <span>Manage Products Grid</span>
          </Link>

          <Link 
            to="/admin/product/create"
            className="flex items-center space-x-2 bg-brandOrange hover:bg-brandOrange-hover text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-brandOrange/20 transition"
          >
            <PlusCircle size={18} />
            <span>Add Product</span>
          </Link>
          
          <Link 
            to="/admin/expenses"
            className="flex items-center space-x-2 bg-charcoal-dark hover:bg-gray-800 text-gray-200 border border-gray-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition"
          >
            <FileText size={18} />
            <span>Expenses</span>
          </Link>
        </div>
      </div>

      {/* Main Content State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
          <p className="text-gray-400 text-sm font-medium">Connecting to MongoDB & fetching live data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertCircle size={22} />
            <span className="font-semibold">{error}</span>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="text-xs bg-red-600/20 hover:bg-red-600 hover:text-white border border-red-500/40 px-3 py-1.5 rounded-lg transition"
          >
            Retry Connection
          </button>
        </div>
      ) : (
        <>
          {/* Real Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Products</span>
                <div className="p-3 bg-brandOrange/10 text-brandOrange rounded-xl border border-brandOrange/20">
                  <Package size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{totalProducts}</h3>
              <p className="text-xs text-gray-400 mt-1">Items currently in database</p>
            </div>

            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Low Stock Alert</span>
                <div className="p-3 bg-yellow-500/10 text-yellow-400 rounded-xl border border-yellow-500/20">
                  <PackageX size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{lowStockProducts.length}</h3>
              <p className="text-xs text-yellow-400 mt-1 font-medium">Items &le; 3 units in stock</p>
            </div>

            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Orders Received</span>
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{orders.length}</h3>
              <p className="text-xs text-blue-400 mt-1 font-medium">Total customer purchases</p>
            </div>

            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Total Revenue</span>
                <div className="p-3 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
                  <DollarSign size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-white mt-4">
                Rs. {totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-green-400 mt-1 font-medium">
                Calculated from real orders
              </p>
            </div>

          </div>

          {/* Visual Sales Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Sales Revenue Trend Chart */}
            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <TrendingUp size={18} className="text-brandOrange" />
                    <span>Sales Revenue Trend</span>
                  </h3>
                  <p className="text-xs text-gray-400">Daily revenue generated from live orders</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                    No sales data available for charts yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis dataKey="date" stroke="#a0aec0" fontSize={11} />
                      <YAxis stroke="#a0aec0" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Orders Volume Chart */}
            <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <ShoppingBag size={18} className="text-blue-400" />
                    <span>Orders Volume</span>
                  </h3>
                  <p className="text-xs text-gray-400">Daily count of received store orders</p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                {chartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 text-xs">
                    No order data available for charts yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                      <XAxis dataKey="date" stroke="#a0aec0" fontSize={11} />
                      <YAxis stroke="#a0aec0" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="ordersCount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

          </div>

          {/* Real Live Products Inventory Table */}
          <div className="bg-charcoal border border-charcoal-light rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Live Product Catalog</h3>
                <p className="text-xs text-gray-400">Directly fetched from database (`GET /products`)</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  to="/admin/products"
                  className="text-xs bg-purple-600/20 text-purple-400 border border-purple-500/30 px-3.5 py-2 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition"
                >
                  Manage Grid & Stock
                </Link>
                <Link 
                  to="/admin/product/create"
                  className="text-xs bg-brandOrange text-white px-3.5 py-2 rounded-xl font-bold hover:bg-brandOrange-hover transition shadow-md shadow-brandOrange/20"
                >
                  + Add New Product
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <PackageX className="w-12 h-12 text-gray-600 mx-auto" />
                <h4 className="text-white font-bold text-base">No Products in Database</h4>
                <p className="text-gray-400 text-xs max-w-sm mx-auto">
                  Apne store mein pehla product add karne ke liye upar "+ Add New Product" button par click karein.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-charcoal-dark text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                      <th className="py-3.5 px-6 font-semibold">Image</th>
                      <th className="py-3.5 px-6 font-semibold">Product Name</th>
                      <th className="py-3.5 px-6 font-semibold">Category</th>
                      <th className="py-3.5 px-6 font-semibold">Price</th>
                      <th className="py-3.5 px-6 font-semibold">Stock Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800 text-sm">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-charcoal-dark/50 transition">
                        <td className="py-3 px-6">
                          <img 
                            src={product.image || 'https://via.placeholder.com/150'} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded-lg bg-charcoal-dark border border-gray-700" 
                          />
                        </td>
                        <td className="py-3 px-6 font-bold text-white">{product.name}</td>
                        <td className="py-3 px-6 text-gray-300">
                          <span className="text-xs bg-gray-800 text-brandOrange px-2.5 py-1 rounded-md font-medium">
                            {product.category || 'General'}
                          </span>
                        </td>
                        <td className="py-3 px-6 font-black text-white">
                          Rs. {Number(product.price)?.toLocaleString()}
                        </td>
                        <td className="py-3 px-6">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            Number(product.countInStock) > 0 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {product.countInStock} units
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};