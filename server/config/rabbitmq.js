const amqp = require("amqplib");

let channel = null;
const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL, {
      reconnect: true,
      rejectUnauthorized: true,
    });
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.log("error in rabbitmq connection");
  }
};

const publishToQueue = async (queueName, data) => {
  try {
    if (!channel) {
      console.log("Rabbitmq channel is not initalized");
      return;
    }
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    console.log("Message sent to queue:", queueName);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connectRabbitMQ,
  publishToQueue,
};
