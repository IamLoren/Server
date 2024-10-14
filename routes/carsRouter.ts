import express from "express";
import carsControllers from "../controllers/carsControllers";

const carsRouter = express.Router();

carsRouter.get("/", carsControllers.getAllCars);


export default carsRouter;