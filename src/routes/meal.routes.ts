import { Router } from "express";
import FoodController from "../controllers/food.controller";
import MealController from "../controllers/meal.controller";

class MealRoutes {
  router = Router();
  controller = new MealController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Meal
    this.router.post("/", this.controller.create);

    // // Retrieve all Meals
    // this.router.get("/", this.controller.findAll);

    // Retrieve a single Meal with id
    this.router.get("/:id", this.controller.getById);

    // // Update a Meal with id
    // this.router.put("/:id", this.controller.update);

    // Delete a Meal with id
    this.router.delete("/:id", this.controller.delete);
  }
}

export default new MealRoutes().router;
