import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  Loader2,
  Sparkles,
  Tags,
  Wallet,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { expenseAPI } from '../services/api';

export default function AddExpense() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialFormData = {
    type: 'expense',
    note: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] = useState(initialFormData);

  const categories = {
    expense: ['Food', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.note.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setLoading(true);
    try {
      await expenseAPI.createExpense({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Reset form
      setFormData(initialFormData);
      
      // Show success toast
      toast.success(
        formData.type === 'expense' 
          ? 'Chi tiêu đã được thêm thành công!' 
          : 'Thu nhập đã được thêm thành công!',
        {
          duration: 4000,
        }
      );
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const amountValue = Number(formData.amount) || 0;
  const selectedTypeConfig = {
    income: {
      label: 'Income',
      icon: ArrowUpRight,
      badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      cardClass: 'from-emerald-500 to-teal-500',
    },
    expense: {
      label: 'Expense',
      icon: ArrowDownLeft,
      badgeClass: 'bg-rose-100 text-rose-700 border border-rose-200',
      cardClass: 'from-rose-500 to-red-500',
    },
  }[formData.type];
  const TypeIcon = selectedTypeConfig.icon;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Add Transaction</h1>
          <p className="text-gray-500 mt-1">Record income or expense with better detail</p>
        </div>

        <div className="relative p-6 md:p-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 left-20 w-80 h-80 bg-cyan-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
            <div className="bg-white/95 backdrop-blur rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-7">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">New Transaction</h2>
                  <p className="text-slate-500 mt-1">Fill the form below to keep your finance records organized.</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold w-fit ${selectedTypeConfig.badgeClass}`}>
                  <TypeIcon className="w-4 h-4" />
                  {selectedTypeConfig.label}
                </span>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Type</label>
                  <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => handleTypeChange('income')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        formData.type === 'income'
                          ? 'bg-emerald-500 text-white shadow'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Income
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeChange('expense')}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        formData.type === 'expense'
                          ? 'bg-rose-500 text-white shadow'
                          : 'text-slate-600 hover:bg-white'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      Expense
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                    <input
                      type="text"
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      placeholder="e.g., Monthly Salary"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (VND)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0"
                      step="1000"
                      min="0"
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <div className="relative">
                      <Tags className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none bg-white cursor-pointer"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories[formData.type].map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                    <div className="relative">
                      <CalendarDays className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all ${
                      loading
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" />
                        Adding...
                      </span>
                    ) : (
                      'Add Transaction'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="sm:w-36 py-3.5 rounded-xl font-semibold text-slate-600 border-2 border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-5 xl:sticky xl:top-6">
              <div className={`rounded-3xl bg-gradient-to-br ${selectedTypeConfig.cardClass} text-white p-6 shadow-lg`}>
                <div className="flex items-center gap-2 mb-4 text-white/90">
                  <Sparkles className="w-5 h-5" />
                  <p className="font-semibold">Live Preview</p>
                </div>
                <p className="text-sm text-white/80">{formData.category || 'Uncategorized'}</p>
                <h3 className="text-2xl font-bold mt-1 truncate">
                  {formData.note || 'Transaction title'}
                </h3>
                <p className="text-3xl font-extrabold mt-5">
                  {formData.type === 'income' ? '+' : '-'}{amountValue.toLocaleString('vi-VN')}₫
                </p>
                <p className="mt-2 text-white/85 text-sm">{formData.date || 'Select date'}</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories[formData.type].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat }))}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        formData.category === cat
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 mb-3">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Tips</h3>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  Write a clear title and pick the correct category. Consistent records make your dashboard and reports much more accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
