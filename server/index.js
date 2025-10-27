// const express = require("express");
// const app = express();
// const cors = require("cors");
// const mongoose = require("mongoose");
// const port = process.env.PORT || 5000;
// require("dotenv").config();

// const { swaggerDocs } = require("./swagger"); // 👈 Import Swagger setup

// // middleware
// app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://book-app-frontend-tau.vercel.app"],
//     credentials: true,
//   })
// );

// // routes
// const bookRoutes = require("./src/books/book.route");
// const orderRoutes = require("./src/orders/order.route");
// const userRoutes = require("./src/users/user.route");
// const adminRoutes = require("./src/stats/admin.stats");
// const favoriteRoutes = require("./src/favorites/favorite.route");
// const subscriberRoutes = require("./src/subscribers/subscriber.route");

// app.use("/api/books", bookRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/auth", userRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/favorites", favoriteRoutes);
// app.use("/api/subscribers", subscriberRoutes);

// // Swagger setup
// swaggerDocs(app);

// async function main() {
//   await mongoose.connect(process.env.DB_URL);
//   app.use("/", (req, res) => {
//     res.send("Book Store Server is running!");
//   });
// }

// main()
//   .then(() => console.log("Mongodb connect successfully!"))
//   .catch((err) => console.log(err));

// app.listen(port, () => {
//   console.log(`🚀 Book Store app listening on port ${port}`);
// });

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();

const { swaggerDocs } = require("./swagger"); // 👈 Import Swagger setup

// middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://book-app-frontend-tau.vercel.app"],
    credentials: true,
  })
);

// routes
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");
const favoriteRoutes = require("./src/favorites/favorite.route");
const subscriberRoutes = require("./src/subscribers/subscriber.route");
const booksellerRoutes = require("./src/users/bookseller.route");

app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/subscribers", subscriberRoutes);
app.use("/api/bookseller", booksellerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Book Store Server is running!");
});

// Swagger setup
swaggerDocs(app);

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongodb connected successfully!");
    
    app.listen(port, () => {
      console.log(`🚀 Book Store app listening on port ${port}`);
      console.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

main();