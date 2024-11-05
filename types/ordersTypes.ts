import { Request, Response, NextFunction } from 'express'

export interface CreateOrderResponse extends Response {
    adminApprove: boolean,
    carId: string,
    clientEmail: string,
    clientId: string,
    cost: number,
    createdAt: string,
    createdBy: "admin" | "user",
    orderType: "rent" | "oil change" | "repair" | "maintenance" | "insurance",
    phoneNumber: string,
    orderStatus: "active" | "inProgress" | "completed",
    time: {
        startDate: string,
        endDate: string,
    },
    updatedAt: string,
    _id: string,
}