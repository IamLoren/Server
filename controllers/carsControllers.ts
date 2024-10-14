import { Request, Response, NextFunction } from 'express'
import Car from '../models/Car'

const getAllCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cars = await Car.find()
        res.status(200).json(cars)
    } catch (error) {
        console.error('Error fetching cars:', error)

        res.status(500).json({
            message: 'Failed to retrieve cars. Please try again later.',
            error: error instanceof Error ? error.message : 'Unknown error',
        })
    }
}

export default {
    getAllCars,
}
