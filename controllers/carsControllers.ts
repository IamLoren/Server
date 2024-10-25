import { Request, Response, NextFunction } from 'express'
import Car from '../models/Car'

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cars = await Car.find()
        if (!cars || cars.length === 0) {
            throw new Error('List of cars was not founded')
        }
        res.status(200).json(cars)
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : 'Unknown error',
        })
        next(error)
    }
}

export default {
    getAllCars,
}
