import { RowDataPacket } from "mysql2";
import Food from "./food.model";

export default interface Meal extends RowDataPacket {
  id?: number;
  name?: string;
}

export interface MealWithFoods {
  id?: number;
  name?: string;
  foods?: {
    quantity: number | null;
    food: {
      id: number | null;
      name?: string | null;
      protein?: number | null;
      carbs?: number | null;
      fats?: number | null;
    };
  }[];
}

export interface MealRow extends RowDataPacket {
  mealId: number;
  mealName: string;
  foodId: number | null; // `null` in case there are no associated foods
  foodName: string | null; // `null` in case there are no associated foods
  protein: number | null; // `null` in case there are no associated foods
  carbs: number | null; // `null` in case there are no associated foods
  fats: number | null; // `null` in case there are no associated foods
  quantity: number | null; // `null` in case there are no associated foods
}
