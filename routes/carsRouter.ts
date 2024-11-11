import express from "express";
import carsControllers from "../controllers/carsControllers";
import { authenticate } from "../middleware/autenticate";

const carsRouter = express.Router();

carsRouter.get("/", carsControllers.getAllCars);

carsRouter.put("/:id", authenticate, carsControllers.updateCar);

carsRouter.put("/availability/:id", authenticate, carsControllers.updateAvailability);

carsRouter.put("/changeavailability/:id", authenticate, carsControllers.changeAvailability);

export default carsRouter;