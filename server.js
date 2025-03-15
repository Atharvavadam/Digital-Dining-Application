const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

// Models
const MenuItem = mongoose.model("MenuItem", {
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
});

const Order = mongoose.model("Order", {
  items: [{ name: String, quantity: Number }],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
});

// Routes
app.get("/", (req, res) => res.send("Digital Dining API Running"));

// Get Menu Items
app.get("/menu", async (req, res) => {
  const menu = await MenuItem.find();
  res.json(menu);
});

// Add Menu Item
app.post("/menu", async (req, res) => {
  const newItem = new MenuItem(req.body);
  await newItem.save();
  res.json({ message: "Menu item added", item: newItem });
});

// Place Order
app.post("/order", async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.json({ message: "Order placed successfully", order: newOrder });
});

// Get Orders
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// Update Order Status
app.put("/order/:id", async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: "Order status updated" });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
