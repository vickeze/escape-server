import { Router } from "express";
import WeightController from "../controllers/weight.controller";
import { verifyToken } from "../middleware/authJwt";

class WeightRoutes {
  router = Router();
  controller = new WeightController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/", [verifyToken], this.controller.create);

    this.router.get("/", [verifyToken], this.controller.findAll);

    this.router.get("/:date", [verifyToken], this.controller.findByDate);

    this.router.put("/", [verifyToken], this.controller.update);
  }
}

export default new WeightRoutes().router;
