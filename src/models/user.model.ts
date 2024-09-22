import { RowDataPacket } from "mysql2";

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface UserAuth extends RowDataPacket {
  username: string;
  password: string;
}
