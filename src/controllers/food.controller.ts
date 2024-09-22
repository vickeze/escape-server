import { Request, Response } from "express";
import Food from "../models/food.model";
import foodRepository from "../repositories/food.repository";

export default class FoodController {
  async create(req: Request, res: Response) {
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }

    try {
      const food: Food = req.body;
      const savedFood = await foodRepository.create(food);

      res.status(201).send(savedFood);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving food.",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const name = typeof req.query.name === "string" ? req.query.name : "";

    try {
      const tutorials = await foodRepository.retrieveAll({ name: name });

      res.status(200).send(tutorials);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving foods.",
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const tutorial = await foodRepository.retrieveById(id);

      if (tutorial) res.status(200).send(tutorial);
      else
        res.status(404).send({
          message: `Cannot find Food with id=${id}.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Food with id=${id}.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    let food: Food = req.body;
    food.id = parseInt(req.params.id);

    try {
      const num = await foodRepository.update(food);

      if (num == 1) {
        res.send({
          message: "Food was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Food with id=${food.id}. Maybe Food was not found or req.body is empty!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Tutorial with id=${food.id}.`,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await foodRepository.delete(id);

      if (num == 1) {
        res.send({
          message: "Food was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Food with id=${id}. Maybe Food was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Food with id==${id}.`,
      });
    }
  }
}
