import { ResultSetHeader } from "mysql2";
import connection from "../db";
import { DailyWeight, DailyWeightData } from "../models/weights.model";
interface WeightRepositoryType {
  create(weight: DailyWeight): Promise<ResultSetHeader>;
  retrieveAll(user_id: number): Promise<DailyWeightData[]>;
  retrieveByDate(user_id: number, date: Date): Promise<DailyWeightData[]>;
  update(weight: DailyWeight): Promise<number>;
}

class WeightRepository implements WeightRepositoryType {
  create(weight: DailyWeight): Promise<ResultSetHeader> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO weights, user_id (value) VALUES (?, ?)",
        [weight.value, weight.user_id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  retrieveAll(user_id: number): Promise<DailyWeightData[]> {
    return new Promise((resolve, reject) => {
      connection.query<DailyWeightData[]>(
        `
        SELECT * FROM weights WHERE user_id = ?
        `,
        [user_id],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }
  retrieveByDate(user_id: number, date: Date): Promise<DailyWeightData[]> {
    return new Promise((resolve, reject) => {
      connection.query<DailyWeightData[]>(
        `
       SELECT * 
FROM weights
WHERE user_id = ?
  AND DATE(date) = ?
        `,
        [user_id, date],
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
    });
  }

  update(weight: DailyWeight): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "UPDATE weights SET value = ? WHERE user_id = ? AND date = ?",
        [weight.value, weight.user_id, new Date()],
        (err, res) => {
          if (err) reject(err);
          else resolve(res.affectedRows);
        }
      );
    });
  }
}

export default new WeightRepository();
