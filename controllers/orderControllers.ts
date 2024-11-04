import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Orders from '../models/Orders';
import { CreateOrderResponse } from '../types/ordersTypes';

const createOrder = async (
    req: Request,
    res: CreateOrderResponse,
    next: NextFunction
) => {

    try {
        const orderData = req.body;
        const convertedTime = {time: {startDate: new Date(orderData.time.startDate).toISOString(), endDate: new Date(orderData.time.endDate).toISOString()}}
        const orderDataISODate = {...orderData, ...convertedTime}
        const newOrder = await Orders.create(orderDataISODate)
        res.status(201).json({
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
        next(error)
    }
}

const getAllOrders = async (req:Request, res:Response, next:NextFunction) => {
    try {

        const orders = await Orders.find();

        res.status(200).json({
            orders
        })
    } catch (error) {
        next(error)
    }
}

export default {
    createOrder,
    getAllOrders
}
