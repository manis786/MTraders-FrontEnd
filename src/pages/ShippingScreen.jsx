import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, ArrowRight, ArrowLeft, MapPin, Building, Phone, Hash } from 'lucide-react';

export const ShippingScreen = () => {
  // Load existing shipping address from localStorage if user goes back
  const shippingAddressFromStorage = JSON.parse(localStorage.getItem('shippingAddress')) || {};

  const [address, setAddress] = useState(shippingAddressFromStorage.address || '');
  const [city, setCity] = useState(shippingAddressFromStorage.city || 'Karachi');
  const [postalCode, setPostalCode] = useState(shippingAddressFromStorage.postalCode || '');
  const [phone, setPhone] = useState(shippingAddressFromStorage.phone || '');

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Save shipping details to localStorage
    const shippingData = { address, city, postalCode, phone };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingData));
    
    // Move to Payment Method screen
    navigate('/payment');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      
      {/* Top Header & Step Indicator */}
      <div className="flex items-center justify-between pt-4">
        <Link 
          to="/cart" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Cart</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-brandOrange font-bold bg-brandOrange/10 border border-brandOrange/20 px-3 py-1 rounded-full">
          Step 1: Shipping Address
        </span>
      </div>

      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <Truck className="text-brandOrange" size={28} />
            <span>Shipping <span className="text-brandOrange">Details</span></span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter where you want your Memon Traders order delivered.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          
          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Street Address / House No / Area *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Shop # 5, Zamzama Commercial Lane 5, DHA Phase V"
                className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                City *
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Karachi"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Postal Code (Optional)
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="74000"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Contact Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="w-full bg-brandOrange hover:bg-brandOrange-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brandOrange/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>Continue to Payment</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};