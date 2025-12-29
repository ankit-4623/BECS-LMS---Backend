import express from "express";
import dotenv from "dotenv";
import { connectRabbitMQ } from "./rabbitmqConfig.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send("Mail Service is running");
// });

app.listen(PORT, () => {
      connectRabbitMQ();
  console.log(`Mail Service is running on port ${PORT}`);
});