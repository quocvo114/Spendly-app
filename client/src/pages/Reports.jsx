import { useState, useEffect } from 'react';
import { BarChart3, PieChart, Loader2, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { expenseAPI } from '../services/api';

export default function Reports() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalTransactions: 0,
    savingsRate: 0,
    avgExpense: 0,
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await expenseAPI.getAllExpenses();
      setExpenses(data);
      
      // Calculate statistics
      const totalIncome = data.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
      const totalExpenses = data.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
      const expenseCount = data.filter(e => e.type === 'expense').length;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      setStats({
        totalTransactions: data.length,
        savingsRate: savingsRate,
        avgExpense: expenseCount > 0 ? totalExpenses / expenseCount : 0,
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
      });

      // Calculate category breakdown
      const expensesByCategory = data
        .filter(e => e.type === 'expense')
        .reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {});

      const breakdown = Object.entries(expensesByCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      setCategoryBreakdown(breakdown);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    Food: 'bg-blue-500',
    Transport: 'bg-red-500',
    Utilities: 'bg-green-500',
    Health: 'bg-yellow-500',
    Entertainment: 'bg-purple-500',
    Shopping: 'bg-pink-500',
    Other: 'bg-gray-500',
    Salary: 'bg-indigo-500',
    Freelance: 'bg-teal-500',
    Investment: 'bg-orange-500',
    Business: 'bg-cyan-500',
    Gift: 'bg-rose-500',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-6 py-3.5">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 mt-1">View your financial analytics</p>
        </div>

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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-2">Total Transactions</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</h3>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-2">Savings Rate</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.savingsRate.toFixed(0)}%</h3>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-gray-500 text-sm font-medium mb-2">Avg. Expense</p>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.avgExpense.toLocaleString('vi-VN')}₫</h3>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Bar Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Income vs Expenses</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Bar Chart */}
                    <div className="flex items-end justify-around h-64 border-b border-l border-gray-200 pb-4 pl-4">
                      {/* Income Bar */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full max-w-[100px] bg-blue-500 rounded-t-lg transition-all" 
                             style={{ height: `${Math.max((stats.totalIncome / Math.max(stats.totalIncome, stats.totalExpenses, stats.balance)) * 200, 20)}px` }}>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900">Income</p>
                          <p className="text-xs text-gray-500">{stats.totalIncome.toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>

                      {/* Expenses Bar */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full max-w-[100px] bg-red-500 rounded-t-lg transition-all" 
                             style={{ height: `${Math.max((stats.totalExpenses / Math.max(stats.totalIncome, stats.totalExpenses, stats.balance)) * 200, 20)}px` }}>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900">Expenses</p>
                          <p className="text-xs text-gray-500">{stats.totalExpenses.toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>

                      {/* Balance Bar */}
                      <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full max-w-[100px] bg-green-500 rounded-t-lg transition-all" 
                             style={{ height: `${Math.max((stats.balance / Math.max(stats.totalIncome, stats.totalExpenses, stats.balance)) * 200, 20)}px` }}>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900">Balance</p>
                          <p className="text-xs text-gray-500">{stats.balance.toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expense by Category */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Expense by Category</h2>
                  </div>
                  
                  {categoryBreakdown.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                      <p className="text-gray-400">No expense data available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Progress Bars */}
                      {categoryBreakdown.map((item, index) => (
                        <div key={item.category}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                            <span className="text-sm font-bold text-gray-900">{item.percentage.toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${categoryColors[item.category] || 'bg-gray-500'} transition-all`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{item.amount.toLocaleString('vi-VN')}₫</p>
                        </div>
                      ))}
                      
                      {/* Legend */}
                      <div className="pt-4 mt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          {categoryBreakdown.slice(0, 5).map((item) => (
                            <div key={item.category} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${categoryColors[item.category] || 'bg-gray-500'}`}></div>
                              <span className="text-xs text-gray-600">{item.category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
