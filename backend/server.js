const express = require("express");
const mongoose = require("mongoose");
const redis = require("ioredis");
const dotenv = require("dotenv");
const productRoutes = require("./routes/products");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connecting to MongoDB (using the service name from docker-compose)
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Connecting to Redis
const redisClient = new redis({
  host: "localhost",
  port: 6379,
});
redisClient.on("connect", () => console.log("Connected to Redis"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

app.use("/api/products", productRoutes);
