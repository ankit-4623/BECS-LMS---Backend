import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL, {
      reconnect: true,
      rejectUnauthorized: true,
    });
    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Mail Service consumer started, listening for otp emails");

    await channel.consume(queueName, async (msg) => {
      if (msg !== null) {
        const { to, subject, body } = JSON.parse(msg.content.toString());
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true, // Use SSL/TLS for port 465
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
          connectionTimeout: 20000, // Increased timeout for cloud environments
          greetingTimeout: 20000,
          socketTimeout: 30000,
        });
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
          // Don't ack the message so it stays in queue or move to DLQ? 
          // For now, let's just log it. If we don't ack, it might retry 
          // infinitely if the error is persistent.
          // channel.nack(msg); 
        }
      }
    });
  } catch (error) {
    console.error("❌ Error in RabbitMQ connection:", error.message);
  }
};
