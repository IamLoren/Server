import express from "express";

import validateBody from "../middleware/validateBody.js";
import authController from "../controllers/authController.js";
import { signInSchema, signUpSchema } from "../schemas/userCredentialSchema.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signUpSchema), authController.register);

authRouter.post("/signin", validateBody(signInSchema), authController.login);

export default authRouter;