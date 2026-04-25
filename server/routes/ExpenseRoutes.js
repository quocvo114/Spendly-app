import express from "express"
import { createExpense, getExpenses, getExpensesByDate, deleteExpense, updateExpense } from "../controllers/ExpenseControllers.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/day", protect, getExpensesByDate);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;