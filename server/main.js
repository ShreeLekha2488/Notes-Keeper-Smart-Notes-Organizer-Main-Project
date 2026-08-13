const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const folderRoutes = require("./routes/folderRoutes");
const tagRoutes = require("./routes/tagRoutes");

dotenv.config();

const app = express();


// ===============================
// CORS
// ===============================

const allowedOrigins = [
  "http://localhost:5173",
  "https://notekeepers.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// ===============================
// BODY PARSER
// ===============================

app.use(express.json());


// ===============================
// DATABASE
// ===============================

connectDB();


// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/tags", tagRoutes);


// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Notes Keeper Backend API is running",
  });
});


// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("==================================");
  console.log("🚀 Notes Keeper Backend Started");
  console.log(`🌐 Port: ${PORT}`);
  console.log("==================================");
});