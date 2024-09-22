import { Router } from "express";
import AuthController from "../controllers/auth.controller";

class AuthRoutes {
  router = Router();
  controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.router.post("/signup", this.controller.signUp);
    this.router.post("/login", this.controller.login);

    // // Retrieve all Meals
    // this.router.get("/", this.controller.findAll);

    // Retrieve a single Meal with id
    // this.router.get("/:id", this.controller.getById);

    // // Update a Meal with id
    // this.router.put("/:id", this.controller.update);

    // Delete a Meal with id
    // this.router.delete("/:id", this.controller.delete);
  }
}

export default new AuthRoutes().router;
