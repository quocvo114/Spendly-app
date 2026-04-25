import Expense from "../models/Expense.js";

 //Create expense
export const createExpense = async(req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    // Debug log to check received data
    console.log('Creating expense:', { type, amount, category, note, date });

    const expense = await Expense.create({
        user: req.user,
        type,
        amount,
        category,
        note,
        date,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({message: error.message});
  }
};

  // GET all expenses of logged-in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET expenses by date (YYYY-MM-DD)
export const getExpensesByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query is required (YYYY-MM-DD)' });
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const expenses = await Expense.find({
      user: req.user,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    console.error('Get expenses by date error:', error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE expense
export const updateExpense = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Check if the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update fields
    expense.type = type || expense.type;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.note = note || expense.note;
    expense.date = date || expense.date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: error.message });
  }
};