import { ResultSetHeader } from "mysql2";
import connection from "../db";

import Meal, { MealRow, MealWithFoods } from "../models/meal.model";
interface MealRepositoryType {
  create(mealName: string): Promise<Meal>;
  retrieveAll(): Promise<Meal[]>;
  retrieveById(mealId: number): Promise<Meal | undefined>;
  update(meal: Meal): Promise<number>;
  delete(mealId: number): Promise<number>;
  addFoods(
    mealId: number,
    foods: { foodId: number; quantity: number }[]
  ): Promise<void>;
  retrieveMealWithFoods(mealId: number): Promise<MealWithFoods | undefined>;
}

class MealRepository implements MealRepositoryType {
  create(mealName: string): Promise<Meal> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO meals (name) VALUES (?)",
        [mealName],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((meal) => resolve(meal!))
              .catch(reject);
        }
      );
    });
  }

  retrieveAll(): Promise<Meal[]> {
    return new Promise((resolve, reject) => {
      connection.query<Meal[]>("SELECT * FROM meals", (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  retrieveById(mealId: number): Promise<Meal | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<Meal[]>(
        "SELECT * FROM meals WHERE id = ?",
        [mealId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(meal: Meal): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE meals SET name = ? WHERE id = ?",
        [meal.name, meal.id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  delete(mealId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM meals WHERE id = ?",
        [mealId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  addFoods(
    mealId: number,
    foods: { foodId: number; quantity: number }[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const foodValues = foods.map(({ foodId, quantity }) => [
        mealId,
        foodId,
        quantity,
      ]);
      connection.query(
        "INSERT INTO meal_foods (meal_id, food_id, quantity) VALUES ?",
        [foodValues],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  retrieveMealWithFoods(mealId: number): Promise<MealWithFoods | undefined> {
    return new Promise((resolve, reject) => {
      // Query to fetch meal with its foods
      const query = `
        SELECT m.id AS mealId, m.name AS mealName, 
               f.id AS foodId, f.name AS foodName, f.protein, f.carbs, f.fats,
               mf.quantity
        FROM meals m
        LEFT JOIN meal_foods mf ON m.id = mf.meal_id
        LEFT JOIN food f ON mf.food_id = f.id
        WHERE m.id = ?
      `;

      connection.query(query, [mealId], (err, results: MealRow[]) => {
        if (err) reject(err);
        else {
          const meal = results[0];
          if (!meal) {
            resolve(undefined);
            return;
          }

          // Map results to MealWithFoods
          const mealWithFoods: MealWithFoods = {
            id: meal.mealId,
            name: meal.mealName,
            foods: results
              .filter((row) => row.foodId !== null)
              .map((row) => {
                return {
                  quantity: row.quantity,
                  food: {
                    id: row.foodId,
                    name: row.foodName,
                    protein: row.protein,
                    carbs: row.carbs,
                    fats: row.fats,
                  },
                };
              }),
          };

          resolve(mealWithFoods);
        }
      });
    });
  }
}

export default new MealRepository();
