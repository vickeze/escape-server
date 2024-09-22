import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const JWTSECRET: Secret = process.env.JWTSECRET ?? "";

export const verifyToken = (
  req: Request & { user_id: number },
  res: any,
  next: any
) => {
  let tokenHeader = req.headers["authorization"] ?? " ";
  let token = tokenHeader.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, "test", (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    res.locals.user_id = decoded.id;
    next();
  });
};
