import express from "express";
import { authenticate } from "../middleware/autenticate";
import userControllers from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.use(authenticate);

userRouter.put("/updatefavorites", userControllers.updateFavorites);

userRouter.delete("/:userId", userControllers.deleteUserController);

export default userRouter;