import { Request, Response } from "express";
import mealRepository from "../repositories/meal.repository";

export default class MealController {
  async create(req: Request, res: Response) {
    const { mealName, foods } = req.body;

    if (!mealName || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    try {
      const meal = await mealRepository.create(mealName);
      await mealRepository.addFoods(meal.id!, foods);
      res
        .status(201)
        .json({ message: "Meal created successfully", mealId: meal.id });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  }
  async delete(req: Request, res: Response) {
    const mealId = parseInt(req.params.id, 10);

    try {
      const result = await mealRepository.delete(mealId);
      if (result) {
        res.status(200).json({ message: "Meal deleted successfully" });
      } else {
        res.status(404).json({ error: "Meal not found" });
      }
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  }
  async getById(req: Request, res: Response) {
    const mealId = parseInt(req.params.id, 10);

    try {
      const mealWithFoods = await mealRepository.retrieveMealWithFoods(mealId);
      if (mealWithFoods) {
        res.status(200).json(mealWithFoods);
      } else {
        res.status(404).json({ error: "Meal not found" });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Internal server error",
          details: (error as Error).message,
        });
    }
  }
}
