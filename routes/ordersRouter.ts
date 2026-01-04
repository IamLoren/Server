import express, { RequestHandler } from "express";
import { authenticate } from "../middleware/autenticate";
import orderControllers from "../controllers/orderControllers";
import validateBody from "../middleware/validateBody";
import { createOrderSchema, updateOrderSchema } from "../schemas/ordersSchema";

const ordersRouter = express.Router();

ordersRouter.use(authenticate as RequestHandler);

ordersRouter.get("/", orderControllers.getAllOrders as RequestHandler);

ordersRouter.get("/search", orderControllers.searchOrders as RequestHandler);

ordersRouter.get("/search/:id", orderControllers.searchUserHistory as RequestHandler);

ordersRouter.post("/create", validateBody(createOrderSchema), orderControllers.createOrder as RequestHandler);

ordersRouter.put("/:id", validateBody(updateOrderSchema), orderControllers.updateOrder as RequestHandler);

export default ordersRouter;