const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { sendToOrderQueue } = require("../utils/rabbitmq");

router.post("/", async (req, res) => {
  const { userId, items, totalPrice } = req.body;

  try {
    // 1. Зберігаємо в базу зі статусом 'pending'
    const newOrder = new Order({ userId, items, totalPrice });
    const savedOrder = await newOrder.save();

    // 2. Відправляємо в RabbitMQ для подальшої обробки (напр. зменшення залишків, email)
    await sendToOrderQueue(savedOrder);

    res
      .status(201)
      .json({
        message: "Замовлення прийнято на обробку",
        orderId: savedOrder._id,
      });
  } catch (error) {
    res.status(500).json({ message: "Помилка при створенні замовлення" });
  }
});

module.exports = router;
