import { Application } from "express";
import foodRoutes from "./food.routes";
import mealRoutes from "./meal.routes";
import authRoutes from "./auth.routes";
import { verifyToken } from "../middleware/authJwt";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/foods", [verifyToken], foodRoutes);
    app.use("/api/meals", mealRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/weight", authRoutes);
  }
}
