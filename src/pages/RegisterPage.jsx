import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, ArrowRight, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);

    try {
      // AuthContext ka register function call karein
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-charcoal p-8 rounded-2xl border border-charcoal-light shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Create <span className="text-brandOrange">Account</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join Memon Traders for exclusive access & tracking
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Muhammad Anis"
                className="w-full bg-charcoal-dark text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full bg-charcoal-dark text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="03001234567"
                className="w-full bg-charcoal-dark text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-charcoal-dark text-white rounded-lg pl-9 pr-3 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Confirm
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-charcoal-dark text-white rounded-lg pl-9 pr-3 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-white font-bold bg-brandOrange hover:bg-brandOrange-hover shadow-lg shadow-brandOrange/20 transition disabled:opacity-50 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brandOrange hover:underline">
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};