import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import HttpError from "../services/HTTPError.js";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const { JWT_SECRET } = process.env;

interface AuthenticatedRequest extends Request {
    user?: JwtPayload; 
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers as { authorization?: string };

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(HttpError(401, "Not authorized"));
  }

  const token = authorization.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(HttpError(401, "Not authorized"));
      }
      
      req.user = decoded as JwtPayload;
      next();
    });
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};