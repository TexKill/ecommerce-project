const amqp = require("amqplib");

async function sendToOrderQueue(orderData) {
  try {
    const connection = await amqp.connect("amqp://localhost"); // Переконайтеся, що RabbitMQ запущено
    const channel = await connection.createChannel();
    const queue = "order_queue";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(orderData)), {
      persistent: true,
    });

    console.log(" [x] Замовлення відправлено в чергу RabbitMQ");

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("Помилка RabbitMQ:", error);
  }
}

module.exports = { sendToOrderQueue };
