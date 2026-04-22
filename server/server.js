const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

// 🔥 CONNECT DB
connectDB();

const app = express();

// ================= SECURITY =================

// Helmet
app.use(helmet());

// CORS
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5175"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );
app.use(cors({
  origin: true,   // 🔥 allow ALL origins (best for dev)
  credentials: true
}));
// Body parser
app.use(express.json());

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ================= ROUTES =================

app.use("/api/visitors", require("./routes/visitorRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/complaints", require("./routes/complaintRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
// Test
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ================= SOCKET.IO =================

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});


global.io = io; 

io.on("connection", (socket) => {
  socket.on("manualNotification", (data) => {
  io.emit("newNotification", data);
});
  console.log("🟢 User connected:", socket.id);

  // 🔥 FORCE TEST EVENT
  socket.emit("testEvent", {
    msg: "Hello from server 🔥",
  });


  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
  
});

// 🔥 MAKE IO AVAILABLE EVERYWHERE
app.set("io", io);

// ================= ERROR HANDLER =================

app.use(errorHandler);

// ================= START SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});