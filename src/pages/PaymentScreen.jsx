import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ArrowRight, ArrowLeft, Banknote, Building } from 'lucide-react';

export const PaymentScreen = () => {
  // Load existing payment method from localStorage or default to 'Cash on Delivery'
  const paymentMethodFromStorage = JSON.parse(localStorage.getItem('paymentMethod')) || 'Cash on Delivery';

  const [paymentMethod, setPaymentMethod] = useState(paymentMethodFromStorage);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Save selected payment method to localStorage
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    
    // Move to Place Order screen
    navigate('/placeorder');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      
      {/* Top Header & Step Indicator */}
      <div className="flex items-center justify-between pt-4">
        <Link 
          to="/shipping" 
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition text-sm font-medium"
        >
          <ArrowLeft size={18} />
          <span>Back to Shipping</span>
        </Link>
        <span className="text-xs uppercase tracking-widest text-brandOrange font-bold bg-brandOrange/10 border border-brandOrange/20 px-3 py-1 rounded-full">
          Step 2: Payment Method
        </span>
      </div>

      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <CreditCard className="text-brandOrange" size={28} />
            <span>Payment <span className="text-brandOrange">Method</span></span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Choose how you would like to pay for your Memon Traders order.
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Select Payment Option *
            </label>

            {/* Option 1: Cash on Delivery */}
            <div 
              onClick={() => setPaymentMethod('Cash on Delivery')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                paymentMethod === 'Cash on Delivery' 
                  ? 'bg-brandOrange/10 border-brandOrange text-white' 
                  : 'bg-charcoal-dark border-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Banknote className={paymentMethod === 'Cash on Delivery' ? 'text-brandOrange' : 'text-gray-400'} size={24} />
                <div>
                  <p className="font-bold text-sm">Cash on Delivery (COD)</p>
                  <p className="text-xs text-gray-400">Pay cash when your order arrives at your doorstep.</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === 'Cash on Delivery'}
                onChange={() => setPaymentMethod('Cash on Delivery')}
                className="accent-brandOrange w-4 h-4" 
              />
            </div>

            {/* Option 2: Bank Transfer / Digital Wallet */}
            <div 
              onClick={() => setPaymentMethod('Bank Transfer')}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                paymentMethod === 'Bank Transfer' 
                  ? 'bg-brandOrange/10 border-brandOrange text-white' 
                  : 'bg-charcoal-dark border-gray-700 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building className={paymentMethod === 'Bank Transfer' ? 'text-brandOrange' : 'text-gray-400'} size={24} />
                <div>
                  <p className="font-bold text-sm">Direct Bank Transfer / NayaPay / Easypaisa</p>
                  <p className="text-xs text-gray-400">Transfer directly to our corporate bank or digital wallet account.</p>
                </div>
              </div>
              <input 
                type="radio" 
                name="paymentMethod" 
                checked={paymentMethod === 'Bank Transfer'}
                onChange={() => setPaymentMethod('Bank Transfer')}
                className="accent-brandOrange w-4 h-4" 
              />
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-800">
            <button
              type="submit"
              className="w-full bg-brandOrange hover:bg-brandOrange-hover text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brandOrange/20 transition flex items-center justify-center space-x-2 text-sm"
            >
              <span>Continue to Order Review</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};