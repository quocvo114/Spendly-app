import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import { protect } from "./middleware/authMiddleware.js";
import expenseRoutes from "./routes/ExpenseRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

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

//connect MongoDB and start server
console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log(">>> MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`>>> Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error(">>> MongoDB connection error:", err.message);
        process.exit(1);
    });