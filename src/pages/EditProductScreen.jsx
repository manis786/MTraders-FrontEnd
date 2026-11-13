import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  Save, 
  Trash2 
} from 'lucide-react';

export const EditProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    countInStock: '',
    image: '',
    description: ''
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiClient(`/products/${id}`);
        const product = data.product || data;
        setFormData({
          name: product.name || '',
          price: product.price || '',
          category: product.category || '',
          countInStock: product.countInStock !== undefined ? product.countInStock : (product.stock || 0),
          image: product.image || '',
          description: product.description || ''
        });
      } catch (err) {
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await apiClient(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      alert('Product updated successfully!');
      navigate('/admin/products');
    } catch (err) {
      alert(err.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    try {
      await apiClient(`/products/${id}`, {
        method: 'DELETE'
      });
      alert('Product deleted successfully!');
      navigate('/admin/products');
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertCircle size={22} />
          <span className="font-semibold">{error}</span>
        </div>
        <Link to="/admin/products" className="text-xs bg-red-600/20 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <div>
          <Link to="/admin/products" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white mb-2 transition">
            <ArrowLeft size={16} />
            <span>Back to Products Grid</span>
          </Link>
          <h1 className="text-2xl font-black text-white">
            Edit / Delete <span className="text-brandOrange">Product</span>
          </h1>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 disabled:opacity-50"
        >
          {deleting ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
          <span>Delete Product</span>
        </button>
      </div>

      <form onSubmit={handleUpdate} className="bg-charcoal border border-charcoal-light p-8 rounded-2xl shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Product Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Price (Rs.)</label>
            <input
              type="number"
              name="price"
              required
              min="0"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Category</label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Stock Quantity</label>
            <input
              type="number"
              name="countInStock"
              required
              min="0"
              value={formData.countInStock}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Description</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-sm transition resize-none"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={updating}
            className="bg-brandOrange hover:bg-brandOrange-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-brandOrange/20 flex items-center space-x-2 disabled:opacity-50"
          >
            {updating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};