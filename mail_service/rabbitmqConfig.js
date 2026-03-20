import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queueName = "send-otp";
    await channel.assertQueue(queueName, { durable: true });
    console.log("✅ Mail Service consumer started, listening for otp emails");
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
        }
      }
    });
  } catch (error) {
    console.error("❌ Error in RabbitMQ connection:", error.message);
  }
};
