import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ExpenseCalendar from '../components/Calendar';
import { expenseAPI } from '../services/api';
import './CalendarPage.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [dayExpenses, setDayExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allLoading, setAllLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpensesByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchExpensesByDate = async (date) => {
    try {
      setLoading(true);
      setError('');
      const formattedDate = formatDateForApi(date);
      const data = await expenseAPI.getExpensesByDate(formattedDate);
      setDayExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses by date:', err);
      setError(err.response?.data?.message || 'Failed to load expenses for selected day');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllExpenses = async () => {
    try {
      setAllLoading(true);
      const data = await expenseAPI.getAllExpenses();
      setAllExpenses(data);
    } catch (err) {
      console.error('Error fetching all expenses:', err);
    } finally {
      setAllLoading(false);
    }
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const monthLabel = activeStartDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const expensesByDate = useMemo(() => {
    return allExpenses.reduce((acc, expense) => {
      const key = formatDateForApi(new Date(expense.date));
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(expense);
      return acc;
    }, {});
  }, [allExpenses]);

  const dailyIncome = dayExpenses
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const dailyExpense = dayExpenses
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const monthlyExpense = useMemo(() => {
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();

    return allExpenses
      .filter((item) => {
        const itemDate = new Date(item.date);
        return (
          item.type === 'expense' &&
          itemDate.getMonth() === selectedMonth &&
          itemDate.getFullYear() === selectedYear
        );
      })
      .reduce((sum, item) => sum + item.amount, 0);
  }, [allExpenses, selectedDate]);

  const monthlyLimit = 5000000;
  const monthlyUsage = Math.min((monthlyExpense / monthlyLimit) * 100, 100);

  const moveMonth = (step) => {
    const next = new Date(activeStartDate);
    next.setMonth(next.getMonth() + step);
    setActiveStartDate(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  const jumpToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') {
      return null;
    }

    const key = formatDateForApi(date);
    const items = expensesByDate[key];

    if (!items || items.length === 0) {
      return null;
    }

    return (
      <div className="spendly-tile-events">
        {items.slice(0, 2).map((item) => (
          <span
            key={item._id}
            className={`spendly-chip ${item.type === 'income' ? 'spendly-chip-income' : 'spendly-chip-expense'}`}
          >
            {item.note}: {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')}
          </span>
        ))}
        {items.length > 2 && <span className="spendly-chip spendly-chip-muted">+{items.length - 2} more</span>}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <div className="bg-white border-b border-gray-200 px-6 py-3.5">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">Track your transactions by date and month</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-800">{monthLabel}</h2>
                  <div className="inline-flex items-center rounded-xl bg-slate-100 p-1">
                    <button
                      onClick={() => moveMonth(-1)}
                      className="h-9 w-9 rounded-lg text-slate-600 hover:bg-white"
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      onClick={jumpToToday}
                      className="h-9 px-4 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white"
                      type="button"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => moveMonth(1)}
                      className="h-9 w-9 rounded-lg text-slate-600 hover:bg-white"
                      type="button"
                    >
                      <ChevronRight className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>

                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm font-semibold text-slate-500">
                  <button type="button" className="px-5 h-9 rounded-lg bg-white text-blue-600 shadow-sm">Month</button>
                  <button type="button" className="px-5 h-9 rounded-lg cursor-default">Week</button>
                  <button type="button" className="px-5 h-9 rounded-lg cursor-default">Day</button>
                </div>
              </div>

              <ExpenseCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                activeStartDate={activeStartDate}
                onActiveStartDateChange={({ activeStartDate: nextStart }) => setActiveStartDate(nextStart)}
                tileContent={renderTileContent}
              />
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Daily Summary</h3>

                <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5 mb-4">
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-1">Selected Date</p>
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <CalendarDays className="w-4 h-4 text-blue-500" />
                    <span>{formatDateForDisplay(selectedDate)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-1">Income</p>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xl">
                      <TrendingUp className="w-4 h-4" />
                      <span>{dailyIncome.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-1">Expense</p>
                    <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xl">
                      <TrendingDown className="w-4 h-4" />
                      <span>{dailyExpense.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-slate-800">Day Transactions</h3>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {dayExpenses.length} items
                  </span>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-7 h-7 text-blue-500 animate-spin" />
                  </div>
                ) : dayExpenses.length === 0 ? (
                  <p className="text-slate-500 text-sm">No transaction found for this day.</p>
                ) : (
                  <div className="space-y-3">
                    {dayExpenses.slice(0, 5).map((item) => (
                      <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center ${
                              item.type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            <ReceiptText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{item.note}</p>
                            <p className="text-xs text-slate-500 truncate">{item.category}</p>
                          </div>
                        </div>
                        <p className={`font-bold text-sm ${item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Link
                  to="/add-expense"
                  className="mt-5 block w-full text-center rounded-xl border border-blue-200 text-blue-600 font-semibold py-2.5 hover:bg-blue-50 transition-colors"
                >
                  Add Transaction
                </Link>
              </div>

              <div className="rounded-2xl bg-blue-600 text-white p-5 shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Monthly Spending Limit</h3>
                {allLoading ? (
                  <div className="flex items-center gap-2 text-blue-100">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Calculating...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-blue-100 text-sm mb-3">
                      You have used {Math.round(monthlyUsage)}% of your budget.
                    </p>

                    <div className="h-2.5 bg-blue-500 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-emerald-300 rounded-full" style={{ width: `${monthlyUsage}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between text-sm font-semibold text-blue-100">
                      <span>{monthlyExpense.toLocaleString('vi-VN')}₫ Spent</span>
                      <span>{monthlyLimit.toLocaleString('vi-VN')}₫ Limit</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;