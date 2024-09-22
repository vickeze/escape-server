import { ResultSetHeader } from "mysql2";
import connection from "../db";
import Food from "../models/food.model";
interface FoodRepositoryType {
  create(food: Food): Promise<Food>;
  retrieveAll(searchParams: { name: string }): Promise<Food[]>;
  retrieveById(tutorialId: number): Promise<Food | undefined>;
  update(food: Food): Promise<number>;
  delete(foodId: number): Promise<number>;
}

class FoodRepository implements FoodRepositoryType {
  create(food: Food): Promise<Food> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO food (name, protein, carbs, fats) VALUES (?, ?, ?, ?)",
        [food.name, food.protein, food.carbs, food.fats],
        (err, res) => {
          if (err) reject(err);
          else
            this.retrieveById(res.insertId)
              .then((food) => resolve(food!))
              .catch(reject);
        }
      );
    });
  }

  retrieveAll(searchParams: { name?: string }): Promise<Food[]> {
    let query: string = "SELECT * FROM food";
    let condition: string = "";

    if (searchParams?.name)
      condition += `LOWER(name) LIKE '%${searchParams.name}%'`;

    if (condition.length) query += " WHERE " + condition;

    return new Promise((resolve, reject) => {
      connection.query<Food[]>(query, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  retrieveById(foodId: number): Promise<Food> {
    return new Promise((resolve, reject) => {
      connection.query<Food[]>(
        "SELECT * FROM food WHERE id = ?",
        [foodId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res?.[0]);
        }
      );
    });
  }

  update(food: Food): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE food SET name = ?, protein = ?, carbs = ?, fats = ? WHERE id = ?",
        [food.title, food.description, food.published, food.id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }

  delete(foodId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "DELETE FROM tutorials WHERE id = ?",
        [foodId],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}

export default new FoodRepository();
