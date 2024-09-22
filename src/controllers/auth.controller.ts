import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/user.repository";
import { JWTSECRET } from "../middleware/authJwt";

export default class AuthController {
  async signUp(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Invalid input" });
    }
    try {
      const { usernameCount } = await userRepository.getUsernameCount(username);
      if (usernameCount > 0)
        return res.status(400).json({ error: "Username already taken." });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await userRepository.signUp({
        username,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({ id: user }, JWTSECRET, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
      res
        .status(201)
        .json({ message: "Successfull sign up.", accessToken: token });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  }
  async login(req: Request, res: Response) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Invalid input" });
    }
    try {
      const { usernameCount } = await userRepository.getUsernameCount(username);
      if (usernameCount === 0)
        return res.status(400).json({ error: "Username not found." });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }

    try {
      const user = await userRepository.getUserAuth(username);
      console.log(user);
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid)
        res.status(401).json({ error: "Invalid password." });
      console.log(isPasswordValid);
      const token = jwt.sign({ id: user }, JWTSECRET, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
      res.status(200).send({
        id: user.id,
        accessToken: token,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal server error",
        details: (error as Error).message,
      });
    }
  }
}
