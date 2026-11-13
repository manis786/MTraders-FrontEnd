import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // AuthContext ka login function call karein jo token aur user info set karega
      const data = await login(email, password);

      // Agar user Admin hai toh seedha /admin par bhejo, warna home par
      if (data.isAdmin === true) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-charcoal p-8 rounded-2xl border border-charcoal-light shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Welcome <span className="text-brandOrange">Back</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your Memon Traders account
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
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-charcoal-dark text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-charcoal-dark text-white rounded-lg pl-10 pr-4 py-2.5 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-lg text-white font-bold bg-brandOrange hover:bg-brandOrange-hover shadow-lg shadow-brandOrange/20 transition disabled:opacity-50"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brandOrange hover:underline">
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};