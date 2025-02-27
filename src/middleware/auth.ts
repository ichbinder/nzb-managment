import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Kein Token vorhanden" });
  }

  jwt.verify(
    token,
    process.env.TOKEN_SECRET || "defaultSecret",
    (err, decoded) => {
      if (err || !decoded) {
        return res.status(403).json({ message: "Token ungültig" });
      }
      req.user = decoded as DecodedToken;
      next();
    }
  );
};

export default authenticateToken;
