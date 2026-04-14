import { Trash2, TrendingUp, TrendingDown, Edit2, X, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function TransactionItem({ transaction, onDelete, onUpdate }) {
  const isIncome = transaction.type === 'income';
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Convert formatted date back to YYYY-MM-DD for input
  const getISODate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  const [formData, setFormData] = useState({
    type: transaction.type,
    note: transaction.title,
    amount: transaction.amount,
    category: transaction.category,
    date: getISODate(transaction.date),
  });

  const categories = {
    expense: ['Food', 'Transport', 'Utilities', 'Health', 'Entertainment', 'Shopping', 'Other'],
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setDeleting(true);
      try {
        await onDelete(transaction.id);
      } catch (error) {
        console.error('Delete failed:', error);
        setDeleting(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(transaction.id, formData);
      setEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: '' // Reset category when type changes
    }));
  };
  
  if (editing) {
    return (
      <div className="p-4 bg-blue-50 rounded-xl">
        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Type Selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                formData.type === 'income'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                formData.type === 'expense'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Expense
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (₫)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories[formData.type].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              <X className="w-4 h-4 inline mr-1" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 inline mr-1 animate-spin" />
              ) : (
                <Edit2 className="w-4 h-4 inline mr-1" />
              )}
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group ${deleting ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isIncome ? 'bg-green-50' : 'bg-red-50'
        }`}>
          {isIncome ? (
            <TrendingUp className="w-5 h-5 text-green-600" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600" />
          )}
        </div>
        
        {/* Transaction Details */}
        <div>
          <h4 className="font-semibold text-gray-900">{transaction.title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              {transaction.category}
            </span>
            <span className="text-xs text-gray-400">{transaction.date}</span>
          </div>
        </div>
      </div>

      {/* Amount and Actions */}
      <div className="flex items-center gap-4">
        <span className={`text-lg font-bold ${
          isIncome ? 'text-green-600' : 'text-red-600'
        }`}>
          {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')}₫
        </span>
        <div className="flex gap-2">
          <button 
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all"
            onClick={() => setEditing(true)}
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button 
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
