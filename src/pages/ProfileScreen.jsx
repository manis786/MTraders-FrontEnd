import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../utils/apiClient';
import { User, Mail, MapPin, Phone, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

export const ProfileScreen = () => {
  const { userInfo } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient('/users/profile');
        setName(data.name || '');
        setEmail(data.email || '');
        
        // Agar pehle se saved address ho toh pehla address utha lo
        if (data.addresses && data.addresses.length > 0) {
          setAddress(data.addresses[0].address || '');
          setCity(data.addresses[0].city || '');
          setPhone(data.addresses[0].phone || '');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setUpdating(true);

    try {
      // Backend ke updateUserAddress format ke mutabiq payload
      await apiClient('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          addresses: [{ address, city, phone }]
        }),
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-charcoal border border-charcoal-light p-6 sm:p-8 rounded-2xl shadow-xl">
        <span className="text-brandOrange text-xs font-extrabold uppercase tracking-widest bg-brandOrange/10 px-3 py-1 rounded-full border border-brandOrange/20">
          Account Management
        </span>
        <h1 className="text-3xl font-black text-white mt-3">
          User <span className="text-brandOrange">Profile & Shipping</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your personal account details and default delivery address.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <AlertCircle size={20} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-4 rounded-xl flex items-center space-x-3 text-sm">
          <CheckCircle2 size={20} className="shrink-0" />
          <span>Profile address updated successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-charcoal border border-charcoal-light rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Read-only Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  disabled
                  value={name}
                  className="w-full bg-charcoal-dark/60 text-gray-400 rounded-xl pl-10 pr-4 py-3 border border-gray-800 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-charcoal-dark/60 text-gray-400 rounded-xl pl-10 pr-4 py-3 border border-gray-800 text-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-800 my-4" />

          <h3 className="text-lg font-bold text-white mb-2">Default Shipping Address</h3>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Street Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 text-gray-500" size={18} />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House #, Street name, Area (e.g. Kharadar)"
                className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
              />
            </div>
          </div>

          {/* City & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Karachi"
                className="w-full bg-charcoal-dark text-white rounded-xl px-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03001234567"
                  className="w-full bg-charcoal-dark text-white rounded-xl pl-10 pr-4 py-3 border border-gray-700 focus:border-brandOrange focus:outline-none focus:ring-1 focus:ring-brandOrange text-sm transition"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-brandOrange hover:bg-brandOrange-hover disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-brandOrange/20 transition flex items-center space-x-2"
            >
              {updating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};