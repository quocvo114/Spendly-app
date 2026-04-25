import axios from "axios";

// Lấy URL từ environment variable
const rawApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = rawApiUrl ? `${rawApiUrl.replace(/\/+$/, "")}/api` : "/api";

const toDateOnly = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

//create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//add token to requests if exists
api.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Expense API calls
export const expenseAPI = {
  getAllExpenses: async () => {
    const response = await api.get("/expenses");
    return response.data;
  },

  getExpensesByDate: async (date) => {
    try {
      const response = await api.get(`/expenses/day?date=${date}`);
      return response.data;
    } catch (error) {
      // Backward-compatible fallback if deployed backend does not have /expenses/day yet.
      if (error.response?.status === 404) {
        const response = await api.get("/expenses");
        const expenses = Array.isArray(response.data) ? response.data : [];
        return expenses.filter((expense) => toDateOnly(expense.date) === date);
      }

      throw error;
    }
  },

  createExpense: async (expenseData) => {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

export default api;