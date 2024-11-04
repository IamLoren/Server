import express from "express";
import { authenticate } from "../middleware/autenticate";
import orderControllers from "../controllers/orderControllers";
import validateBody from "../middleware/validateBody";
import { createOrderSchema } from "../schemas/ordersSchema";

const ordersRouter = express.Router();

ordersRouter.use(authenticate);

ordersRouter.get("/", orderControllers.getAllOrders);

ordersRouter.post("/create", validateBody(createOrderSchema), orderControllers.createOrder);

export default ordersRouter;