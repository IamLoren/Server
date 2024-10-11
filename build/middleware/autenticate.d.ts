import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export {};
