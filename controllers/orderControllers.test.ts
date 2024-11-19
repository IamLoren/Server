import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Orders from '../models/Orders'
import { CreateOrderResponse } from '../types/ordersTypes'
import UserCredentials from '../models/UserCredentials'
import orderControllers from './orderControllers'

jest.mock('../models/Orders')
jest.mock('../models/UserCredentials')

describe('createOrder function', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should create order with valid data', async () => {
        const req = {
            user: { jwtPayload: 'validUserId' },
            body: {
                createdBy: 'user',
                time: {
                    startDate: '2023-11-01T12:00:00Z',
                    endDate: '2023-11-02T12:00:00Z',
                },
                clientEmail: 'test@example.com',
                phoneNumber: '1234567890',
                carId: 'validCarId',
                clientId: 'validClientId',
                orderType: 'rent',
                cost: 100,
            },
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        const next = jest.fn();
        const mockUser = { _id: 'validUserId' }
        const mockOrder = {
            adminApprove: true,
            carId: 'validCarId',
            clientEmail: 'test@example.com',
            clientId: 'validClientId',
            cost: 100,
            createdAt: new Date().toISOString(),
            createdBy: 'user',
            orderType: 'rent',
            phoneNumber: '1234567890',
            orderStatus: 'active',
            time: {
                startDate: new Date(req.body.time.startDate).toISOString(),
                endDate: new Date(req.body.time.endDate).toISOString(),
            },
            updatedAt: new Date().toISOString(),
            _id: new mongoose.Types.ObjectId(),
        }

        // ;(UserCredentials.findOne as jest.Mock).mockResolvedValue(mockUser)
        ;(Orders.create as jest.Mock).mockResolvedValue(mockOrder)

        await orderControllers.createOrder(req as any, res as any, next)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            adminApprove: mockOrder.adminApprove,
            carId: mockOrder.carId,
            clientEmail: mockOrder.clientEmail,
            clientId: mockOrder.clientId,
            cost: mockOrder.cost,
            createdAt: mockOrder.createdAt,
            createdBy: mockOrder.createdBy,
            orderType: mockOrder.orderType,
            phoneNumber: mockOrder.phoneNumber,
            orderStatus: mockOrder.orderStatus,
            time: mockOrder.time,
            updatedAt: mockOrder.updatedAt,
            _id: mockOrder._id,
        })
    })
})
