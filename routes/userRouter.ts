import express, { RequestHandler } from "express";
import { authenticate } from "../middleware/autenticate";
import userControllers from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.use(authenticate as RequestHandler);

userRouter.get("/", userControllers.getAllUsers as RequestHandler);

userRouter.get("/find/:id", userControllers.getOneUser as RequestHandler);

userRouter.put("/updatefavorites", userControllers.updateFavorites as RequestHandler);

userRouter.delete("/:userId", userControllers.deleteUserController as RequestHandler);

export default userRouter;