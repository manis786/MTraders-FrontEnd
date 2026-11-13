import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../utils/apiClient';
import { 
  ArrowLeft, 
  Loader2, 
  PlusCircle, 
  Trash2, 
  FileText, 
  DollarSign, 
  RefreshCw 
} from 'lucide-react';

export const ExpensesScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'General',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient('/expenses');
      setExpenses(data.expenses || data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please fill in all required expense fields!');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient('/expenses', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setFormData({
        title: '',
        amount: '',
        category: 'General',
        date: new Date().toISOString().split('T')[0]
      });
      fetchExpenses();
    } catch (err) {
      alert(err.message || 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setDeletingId(id);
    try {
      await apiClient(`/expenses/${id}`, {
        method: 'DELETE'
      });
      setExpenses(expenses.filter(exp => exp._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    } finally {
      setDeletingId(null);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <div>
          <Link to="/admin" className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-white mb-2 transition">
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-black text-white">
            Expense <span className="text-brandOrange">Management</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track store operational costs and daily expenditures.</p>
        </div>

        <div className="bg-charcoal-dark border border-gray-700 px-5 py-3 rounded-xl flex items-center space-x-3">
          <div className="p-2 bg-red-500/10 text-red-400 rounded-lg">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-400 block">Total Expenses</span>
            <span className="text-white font-black text-lg">Rs. {totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="bg-charcoal border border-charcoal-light p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <PlusCircle size={18} className="text-brandOrange" />
          <span>Add New Expense</span>
        </h3>

        <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-400">Expense Title / Description</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Electric Bill, Packaging Material"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-xs transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-400">Amount (Rs.)</label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-xs transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-400">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-charcoal-dark text-white rounded-xl p-3 border border-gray-700 focus:border-brandOrange focus:outline-none text-xs transition"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brandOrange hover:bg-brandOrange-hover text-white font-bold p-3 rounded-xl text-xs transition shadow-lg shadow-brandOrange/20 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
              <span>Add Expense</span>
            </button>
          </div>
        </form>
      </div>

      {/* Expenses List Table */}
      <div className="bg-charcoal border border-charcoal-light rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">All Expenses ({expenses.length})</h3>
            <p className="text-xs text-gray-400">Directly fetched from database</p>
          </div>
          <button onClick={fetchExpenses} className="p-2 bg-charcoal-dark hover:bg-gray-800 text-gray-300 border border-gray-700 rounded-xl transition">
            <RefreshCw size={16} className={loading ? 'animate-spin text-brandOrange' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 text-brandOrange animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading expenses...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400">{error}</div>
        ) : expenses.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <FileText className="w-16 h-16 text-gray-600 mx-auto" />
            <h4 className="text-white font-bold text-base">No Expenses Recorded</h4>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">Use the form above to record store expenses.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-charcoal-dark text-gray-400 text-xs uppercase tracking-wider border-b border-gray-800">
                  <th className="py-3.5 px-6 font-semibold">Title</th>
                  <th className="py-3.5 px-6 font-semibold">Category</th>
                  <th className="py-3.5 px-6 font-semibold">Date</th>
                  <th className="py-3.5 px-6 font-semibold">Amount</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-charcoal-dark/50 transition">
                    <td className="py-4 px-6 font-bold text-white">{expense.title}</td>
                    <td className="py-4 px-6 text-gray-300">
                      <span className="text-xs bg-gray-800 text-brandOrange px-2.5 py-1 rounded-md font-medium">
                        {expense.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-xs">
                      {new Date(expense.date || expense.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-black text-white">
                      Rs. {Number(expense.amount)?.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        disabled={deletingId === expense._id}
                        className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 p-2 rounded-xl transition disabled:opacity-50"
                      >
                        {deletingId === expense._id ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
