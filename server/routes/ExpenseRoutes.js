import express from "express"
import { createExpense, getExpenses, deleteExpense, updateExpense } from "../controllers/ExpenseControllers.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

export default router;