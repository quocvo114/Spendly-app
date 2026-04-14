import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TransactionItem from '../components/TransactionItem';
import { expenseAPI } from '../services/api';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await expenseAPI.getAllExpenses();
      setExpenses(data);
      
      // Calculate stats from expenses
      const calculatedStats = data.reduce(
        (acc, expense) => {
          if (expense.type === 'income') {
            acc.income += expense.amount;
          } else {
            acc.expenses += expense.amount;
          }
          return acc;
        },
        { income: 0, expenses: 0 }
      );
      
      calculatedStats.balance = calculatedStats.income - calculatedStats.expenses;
      setStats(calculatedStats);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTransactionForDisplay = (expense) => {
    return {
      id: expense._id,
      title: expense.note,
      category: expense.category,
      date: formatDate(expense.date),
      amount: expense.amount,
      type: expense.type,
    };
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await expenseAPI.deleteExpense(expenseId);
      // Refresh the expenses list
      await fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleUpdateExpense = async (expenseId, updatedData) => {
    try {
      await expenseAPI.updateExpense(expenseId, updatedData);
      // Refresh the expenses list
      await fetchExpenses();
    } catch (err) {
      console.error('Error updating expense:', err);
      setError(err.response?.data?.message || 'Failed to update expense');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3.5">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your financial overview</p>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={DollarSign}
                  title="Total Balance"
                  amount={`${stats.balance.toLocaleString('vi-VN')}₫`}
                  color="blue"
                />
                <StatCard
                  icon={TrendingUp}
                  title="Total Income"
                  amount={`${stats.income.toLocaleString('vi-VN')}₫`}
                  color="green"
                />
                <StatCard
                  icon={TrendingDown}
                  title="Total Expense"
                  amount={`${stats.expenses.toLocaleString('vi-VN')}₫`}
                  color="red"
                />
              </div>

              {/* Recent Transactions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                </div>
                <div className="p-2">
                  {expenses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <TrendingUp className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-center">No transactions yet</p>
                      <p className="text-gray-400 text-sm mt-1">Start by adding your first expense or income</p>
                    </div>
                  ) : (
                    expenses.map((expense) => (
                      <TransactionItem 
                        key={expense._id} 
                        transaction={formatTransactionForDisplay(expense)}
                        onDelete={handleDeleteExpense}
                        onUpdate={handleUpdateExpense}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
