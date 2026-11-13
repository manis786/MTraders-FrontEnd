import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './pages/HomeScreen';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardScreen } from './pages/AdminDashboardScreen';
import { ProductCreateScreen } from './pages/ProductCreateScreen';
import { ProductScreen } from './pages/ProductScreen';
import { AdminOrdersScreen } from './pages/AdminOrdersScreen';
import { AdminRoute } from './components/AdminRoute';
import { ProfileScreen } from './pages/ProfileScreen';
import { CartScreen } from './pages/CartScreen';
import { ShippingScreen } from './pages/ShippingScreen';
import { PaymentScreen } from './pages/PaymentScreen';
import { PlaceOrderScreen } from './pages/PlaceOrderScreen';
import { OrderScreen } from './pages/OrderScreen'; // <-- Added OrderScreen import
import {ManageProductsScreen} from "./pages/ManageProductsScreen";
import {EditProductScreen} from "./pages/EditProductScreen";
import { ExpensesScreen } from './pages/ExpensesScreen';
import { TrackOrderScreen } from './pages/TrackOrderScreen';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-charcoal-dark text-gray-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6">
          <Routes>
            {/* Public & Checkout Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} /> {/* <-- Added Order Details Route */}
            <Route path="/admin/products" element={<ManageProductsScreen />} />
            <Route path="/admin/product/:id/edit" element={<EditProductScreen />} />
            <Route path="/admin/expenses" element={<ExpensesScreen />} />   
            <Route path="/track-order" element={<TrackOrderScreen />} />         
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboardScreen />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/product/create" 
              element={
                <AdminRoute>
                  <ProductCreateScreen />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <AdminRoute>
                  <AdminOrdersScreen />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;