import { RowDataPacket } from "mysql2";

export interface DailyWeightData extends RowDataPacket {
  value: number;
  user_id: number;
}

export interface DailyWeight {
  value: number;
  user_id: number;
}
