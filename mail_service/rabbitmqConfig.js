import amqp from "amqplib";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

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

        try {
          await resend.emails.send({
            from: `BECS LMS <${process.env.EMAIL}>`,
            to,
            subject,
            text: body,
          });
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
