const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dns = require("dns");

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const folderRoutes = require("./routes/folderRoutes");
const tagRoutes = require("./routes/tagRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Background Jobs
require("./jobs/trashCleanupJob");

// Error Middleware
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

// Initialize Express
const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Notes Keeper Backend Running 🚀",
    version: "1.0.0",
    timestamp: new Date(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.clear();
  console.log("==========================================");
  console.log("🚀 Notes Keeper Backend Started");
  console.log(`🌐 Server : http://localhost:${PORT}`);
  console.log("📦 MongoDB : Connected");
  console.log("🕒 Trash Cleanup Scheduler : Running");
  console.log("==========================================");
});