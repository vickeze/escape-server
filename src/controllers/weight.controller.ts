import { Request, Response } from "express";
import { DailyWeight } from "../models/weights.model";
import weightRepository from "../repositories/weight.repository";

export default class WeightController {
  async create(req: Request, res: Response) {
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
      return;
    }
    if (!res.locals.user_id) {
      res.status(400).send({
        message: "Authentication error!",
      });
      return;
    }

    try {
      const weight: DailyWeight = req.body;
      const savedFood = await weightRepository.create(weight);

      res.status(201).send(savedFood);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving food.",
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const name = typeof req.query.name === "string" ? req.query.name : "";
    if (!res.locals.user_id) {
      res.status(400).send({
        message: "Authentication error!",
      });
      return;
    }
    try {
      const weights = await weightRepository.retrieveAll(res.locals.user_id);

      res.status(200).send(weightRepository);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving weights.",
      });
    }
  }

  async findByDate(req: Request, res: Response) {
    if (!req.params?.date) {
      res.status(400).send({
        message: "Invalid input!",
      });
      return;
    }
    if (!res.locals.user_id) {
      res.status(400).send({
        message: "Authentication error!",
      });
      return;
    }
    try {
      const weights = await weightRepository.retrieveByDate(
        res.locals.user_id,
        new Date(req.params.date)
      );

      if (weights) res.status(200).send(weights);
      else
        res.status(404).send({
          message: `Cannot find weights at this date.`,
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving weights.`,
      });
    }
  }

  async update(req: Request, res: Response) {
    let weight: DailyWeight = {
      value: parseFloat(req.params.value),
      user_id: res.locals.user_id as number,
    };
    if (!weight?.user_id && !weight?.value) {
      res.status(400).send({ message: "Invalid input." });
    }

    try {
      const num = await weightRepository.update(weight);

      if (num == 1) {
        res.send({
          message: "Weight was updated successfully.",
        });
      } else {
        res.send({
          message: `There was an error`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error .`,
      });
    }
  }
}
