import { ResultSetHeader, RowDataPacket } from "mysql2";
import connection from "../db";
import { NewUser, UserAuth } from "../models/user.model";

interface UserRepositoryType {
  signUp(newUser: NewUser): Promise<number>;
  getUsernameCount(username: string): Promise<{ usernameCount: number }>;
  getEmailCount(email: string): Promise<{ emailCount: number }>;
}

class UserRepository implements UserRepositoryType {
  signUp(newUser: NewUser): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [newUser.username, newUser.email, newUser.password],
        (err, res) => {
          console.log(res);
          if (err) reject(err);
          else resolve(res.insertId);
        }
      );
    });
  }
  getUsernameCount(username: string): Promise<{ usernameCount: number }> {
    return new Promise((resolve, reject) => {
      connection.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS username_count
        FROM users
        WHERE username = ?`,
        username,
        (err, res) => {
          if (err) reject(err);
          const count = res[0] as { username_count: number };
          resolve({ usernameCount: count.username_count });
        }
      );
    });
  }
  getEmailCount(email: string): Promise<{ emailCount: number }> {
    return new Promise((resolve, reject) => {
      connection.query<RowDataPacket[]>(
        `
        SELECT COUNT(*) AS email_count
        FROM users
        WHERE email = ?`,
        email,
        (err, res) => {
          if (err) reject(err);
          const count = res[0] as { email_count: number };
          resolve({ emailCount: count.email_count });
        }
      );
    });
  }
  getUserAuth(username: string): Promise<UserAuth> {
    return new Promise((resolve, reject) => {
      connection.query<UserAuth[]>(
        `
       SELECT username, password FROM users WHERE username = ?;

`,
        username,
        (err, res) => {
          if (err) reject(err);
          resolve(res?.[0]);
        }
      );
    });
  }
}

export default new UserRepository();
