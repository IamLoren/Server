import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Orders from '../models/Orders';

const createOrder = async (req:Request, res:Response, next:NextFunction) => {

    try {
        const orderData = req.body;
        const newOrder = await Orders.create(orderData)
        res.status(200).json({
            newOrder
        })
    } catch(error) {
        next(error)
    }
    

}

export default {
    createOrder,
}
