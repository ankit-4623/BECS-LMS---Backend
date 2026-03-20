import amqp from "amqplib";
import nodemailer from "nodemailer";

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
          service: "gmail",
          port: 587,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 15000,
          secure: true,
        });
        const mailOptions = {
          from: "BECS LMS",
          to,
          subject,
          text: body,
        };
        await transporter.sendMail(mailOptions);
        channel.ack(msg);
        // console.log(`OTP mail sent to ${to} ${body}`);
      }
    });
  } catch (error) {
    console.log("error in rabbitmq connection");
  }
};
