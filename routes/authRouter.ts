import express, { RequestHandler } from "express";
import validateBody from "../middleware/validateBody.js";
import authController from "../controllers/authController.js";
import { signInSchema, signUpSchema } from "../schemas/userCredentialSchema.js";
import { authenticate } from "../middleware/autenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signUpSchema), authController.register as RequestHandler);

authRouter.post("/signin", validateBody(signInSchema), authController.login as RequestHandler);

authRouter.get("/current", authenticate as RequestHandler, authController.getCurrent as RequestHandler);

authRouter.post("/logout", authenticate as RequestHandler, authController.logout as RequestHandler);

export default authRouter;