import express, { Application } from "express";
import Routes from "./routes";
import cors, { CorsOptions } from "cors";
export default class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: [
        "http://192.168.0.27:3000",
        "http://localhost:3000",
        "http://localhost",
      ],
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(function (req, res, next) {
      setTimeout(next, 1000);
    });
    app.use(express.urlencoded({ extended: true }));
  }
}
