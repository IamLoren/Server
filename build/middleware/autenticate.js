import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpError from "../services/HTTPError.js";
dotenv.config();
const { JWT_SECRET } = process.env;
export const authenticate = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return next(HttpError(401, "Not authorized"));
    }
    const token = authorization.split(" ")[1];
    try {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(HttpError(401, "Not authorized"));
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        next(HttpError(401, "Not authorized"));
    }
};
//# sourceMappingURL=autenticate.js.map