import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Orders from '../models/Orders.js'
import UserCredentials from '../models/UserCredentials.js'
import Car from '../models/Car.js'

interface CustomRequest extends Request {
    user?: {
        jwtPayload: string
    }
}

const createOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const orderData = req.body
        if (orderData.createdBy === 'user' && orderData.orderType !== 'rent') {
            return res.status(403).json({ message: 'User can only create rent orders' });
        }

        const convertedTime = {
            time: {
                startDate: new Date(orderData.time.startDate).toISOString(),
                endDate: new Date(orderData.time.endDate).toISOString(),
            },
        }
        const orderDataISODate = { ...orderData, ...convertedTime }
        const newOrder = await Orders.create(orderDataISODate)
        return res.status(201).json({
            adminApprove: newOrder.adminApprove,
            carId: newOrder.carId,
            clientEmail: newOrder.clientEmail,
            clientId: newOrder.clientId,
            cost: newOrder.cost,
            createdAt: newOrder.createdAt,
            createdBy: newOrder.createdBy,
            orderType: newOrder.orderType,
            phoneNumber: newOrder.phoneNumber,
            orderStatus: newOrder.orderStatus,
            time: newOrder.time,
            updatedAt: newOrder.updatedAt,
            _id: newOrder._id,
        })
    } catch (error) {
        next(error);
        return
    }
}

const getAllOrders = async (
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
        if (admin.role !== 'admin') {
            throw new Error('admin with such id doesnt exist')
        }
        if (admin.role === 'admin') {
            const orders = await Orders.find()
            res.status(200).json({
                orders,
            })
        } else {
            res.status(403)
        }
    } catch (error) {
        next(error)
    }
}

const updateOrder = async (
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
        const userObjectId = new mongoose.Types.ObjectId(userId)
        const admin = await UserCredentials.findOne({ _id: userObjectId })

        if (!admin) {
            throw new Error('admin with such id doesnt exist')
        }
        if (admin.role !== 'admin') {
            return res
                .status(403)
                .json({ message: 'Forbidden: insufficient permissions' })
        }
        if (admin.role === 'admin') {
            const orderId = req.params.id
            const objectId = new mongoose.Types.ObjectId(orderId)
            const updatedData = req.body
            const previousOrder = await Orders.findOne({ _id: objectId })
            const updatedOrder = await Orders.findByIdAndUpdate(
                objectId,
                updatedData,
                {
                    new: true,
                    runValidators: true,
                }
            )
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' })
            }
            return res.status(200).json({ updatedOrder })
        } else {
            return res.status(403)
        }
    } catch (error) {
        next(error)
        return
    }
}

const searchOrders = async (
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
        const user = await UserCredentials.findOne({ _id: objectId })

        if (!user) {
            throw new Error('user with such id doesnt exist')
        }
        if (user.role === 'admin') {
            const startOfToday = new Date()
            startOfToday.setUTCHours(0, 0, 0, 0)

            const endOfToday = new Date()
            endOfToday.setUTCHours(23, 59, 59, 999)

            const orders = await Orders.find({
                'time.endDate': {
                    $gte: startOfToday.toISOString(),
                    $lte: endOfToday.toISOString(),
                },
                orderStatus: 'inProgress',
            })

            res.status(200).json({ orders })
        }

        if (user.role === 'user') {
            const startOfToday = new Date()
            startOfToday.setUTCHours(0, 0, 0, 0)

            const endOfToday = new Date()
            endOfToday.setUTCHours(23, 59, 59, 999)

            const endedOrders = await Orders.find({
                'time.endDate': {
                    $gte: startOfToday.toISOString(),
                },
                orderStatus: 'inProgress',
                clientId: userId,
            })
            const approvedOrders = await Orders.find({
                clientId: userId,
                orderStatus: 'active',
                adminApprove: true,
            })
            console.log(endedOrders, approvedOrders)
            res.status(200).json({ orders: { endedOrders, approvedOrders } })
        }
    } catch (error) {
        next(error)
    }
}

const searchUserHistory = async (
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
        const user = await UserCredentials.findOne({ _id: objectId })

        if (!user) {
            throw new Error('user with such id doesnt exist')
        }
        const param = req.params.id
        const orders = await Orders.find({
            clientId: param,
        })
        console.log(orders)
        res.status(200).json({ orders })
    } catch (error) {}
}

export default {
    createOrder,
    getAllOrders,
    updateOrder,
    searchOrders,
    searchUserHistory,
}
