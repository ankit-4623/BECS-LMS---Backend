import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      console.log("✅ Connected to RabbitMQ");
      return connection;
    } catch (error) {
      console.error(
        `❌ RabbitMQ connection attempt ${i + 1}/${retries} failed:`,
        error.message,
      );
      if (i < retries - 1) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw new Error("Failed to connect to RabbitMQ after multiple attempts");
};

export const connectRabbitMQ = async () => {
  try {
    const connection = await connectWithRetry();
    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Mail Service consumer started, listening for otp emails");

    connection.on("error", (err) => {
      console.error("❌ RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.log("⚠️ RabbitMQ connection closed, reconnecting...");
      setTimeout(connectRabbitMQ, 5000);
    });

    await channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const { to, subject, body } = JSON.parse(msg.content.toString());

        const mailOptions = {
          from: `"BECS LMS" <${process.env.EMAIL}>`,
          to,
          subject,
          text: body,
        };
        try {
          await transporter.sendMail(mailOptions);
          channel.ack(msg);
          console.log(`✅ Mail sent successfully to: ${to}`);
        } catch (mailError) {
          console.error(`❌ Failed to send mail to ${to}:`, mailError.message);
          channel.nack(msg, false, true);
        }
      }
    });
  } catch (error) {
    console.error("❌ Error in RabbitMQ connection:", error.message);
    console.log("Retrying connection in 10 seconds...");
    setTimeout(connectRabbitMQ, 10000);
  }
};
