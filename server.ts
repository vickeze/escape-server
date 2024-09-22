import express, { Application } from "express";
import Server from "./src/index";
import dotenv from "dotenv";
import mealRepository from "./src/repositories/meal.repository";
dotenv.config();

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = parseInt(process.env.APP_PORT ?? "8383");

app
  .listen(PORT, "192.168.0.27", function () {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
