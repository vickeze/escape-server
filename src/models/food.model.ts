import { RowDataPacket } from "mysql2";

export default interface Food extends RowDataPacket {
  id?: number;
  name?: string;
  protein?: number;
  carbs?: number;
  fats?: number;
}
