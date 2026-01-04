import express, { RequestHandler } from "express";
import carsControllers from "../controllers/carsControllers.js";
import { authenticate } from "../middleware/autenticate.js";

const carsRouter = express.Router();

carsRouter.get("/", carsControllers.getAllCars as RequestHandler);

carsRouter.put("/:id", authenticate as RequestHandler, carsControllers.updateCar as RequestHandler);

carsRouter.put("/availability/:id", authenticate as RequestHandler, carsControllers.updateAvailability as RequestHandler);

carsRouter.put("/changeavailability/:id", authenticate as RequestHandler, carsControllers.changeAvailability as RequestHandler);

export default carsRouter;