import express from "express";
import { authenticate } from "../middleware/autenticate";
import orderControllers from "../controllers/orderControllers";
import validateBody from "../middleware/validateBody";
import { createOrderSchema, updateOrderSchema } from "../schemas/ordersSchema";

const ordersRouter = express.Router();

ordersRouter.use(authenticate);

ordersRouter.get("/", orderControllers.getAllOrders);

ordersRouter.get("/search", orderControllers.searchOrders);

ordersRouter.get("/search/:id", orderControllers.searchUserHistory);

ordersRouter.post("/create", validateBody(createOrderSchema), orderControllers.createOrder);

ordersRouter.put("/:id", validateBody(updateOrderSchema), orderControllers.updateOrder);

export default ordersRouter;