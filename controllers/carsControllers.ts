import { Request, Response, NextFunction } from 'express'
import Car from '../models/Car'
import mongoose from 'mongoose'
import UserCredentials from '../models/UserCredentials'

interface CustomRequest extends Request {
    user?: {
        jwtPayload: string
    }
}

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

const updateCar = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user?.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId)
        const admin = await UserCredentials.findOne({ _id: objectId })

        if (!admin) {
            throw new Error('admin with such id doesnt exist')
        }

        if (admin.role === 'admin') {
            const carId = req.params.id
            const objectId = new mongoose.Types.ObjectId(carId)
            const updatedData = req.body
            const updatedCar = await Car.findByIdAndUpdate(
                objectId,
                {
                    $push: {
                        availability: {
                            orderId: updatedData.orderId,
                            startDate: updatedData.startDate,
                            endDate: updatedData.endDate,
                        },
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!updatedCar) {
                res.status(404).json({ message: 'not updated' })
            }
            console.log(updatedCar)
            res.status(200).json({ updatedCar })
        } else {
            res.status(403)
        }
    } catch (error) {
        next(error)
    }
}

const updateAvailability = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user?.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId)
        const admin = await UserCredentials.findOne({ _id: objectId })

        if (!admin) {
            throw new Error('admin with such id doesnt exist')
        }

        if (admin.role === 'admin') {
            const carId = req.params.id
            const objectId = new mongoose.Types.ObjectId(carId)
            const orderId = req.body.orderId

            const car = await Car.findOne({
                _id: objectId,
            })

            if (!car) {
                throw new Error(
                    'Car with the specified orderId in availability not found'
                )
            }

            car.availability.pull({ orderId })
            await car.save()
            res.status(200).json({
                message: 'car availability was updated successfully',
            })
        } else {
            res.status(403)
        }
    } catch (error) {
        next(error)
    }
}

const changeAvailability = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user?.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId)
        const admin = await UserCredentials.findOne({ _id: objectId })

        if (!admin) {
            throw new Error('admin with such id doesnt exist')
        }

        if (admin.role === 'admin') {
            const carId = req.params.id
            const objectId = new mongoose.Types.ObjectId(carId)
            const { orderId, startDate, endDate } = req.body

            const updatedCar = await Car.findOneAndUpdate(
                { _id: objectId, 'availability.orderId': orderId },
                {
                    $set: {
                        'availability.$.startDate': startDate,
                        'availability.$.endDate': endDate,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            )

            if (!updatedCar) {
                res.status(404).json({
                    message: 'Order not found or car not updated',
                })
            } else {
                res.status(200).json({ updatedCar })
            }
        } else {
            res.status(403).json({ message: 'Forbidden' })
        }
    } catch (error) {
        next(error)
    }
}

export default {
    getAllCars,
    updateCar,
    updateAvailability,
    changeAvailability,
}
