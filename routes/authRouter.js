import express from "express";
import validateBody from "../helpers/validateBody.js";
import authController from "../controllers/authController.js";
import { signUpSchema } from "../schemas/userCredentialSchema.js";
const authRouter = express.Router();
authRouter.post("/signup", validateBody(signUpSchema), authController.register);
export default authRouter;
