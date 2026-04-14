import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import expenseRoutes from "./routes/ExpenseRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user
  });
});

app.use("/api/expenses", expenseRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();