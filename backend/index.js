import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const __dirname = path.resolve();


// JSON parsing middleware
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Cookie-parser middleware
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Serve frontend
app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
