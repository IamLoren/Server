import mongoose from 'mongoose'
import UserProfile from '../models/UserProfile'
import userControllers from './userControllers'
import { Request, Response, NextFunction } from 'express'

jest.mock('../models/UserProfile')

describe('updateFavorites function', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    test('should add car to favorites if it does not exist', async () => {
        const req = {
            user: {
                jwtPayload: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
            body: {
                _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100}
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const mockProfile = {
            _id: '670d10e33ca6a0d02fc434a4',
            userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            theme: 'light',
            avatarURL: 'img.jpg',
            favorites: [],
            history: [],
        }

        ;(UserProfile.findOne as jest.Mock).mockResolvedValueOnce(mockProfile)
        ;(UserProfile.findOneAndUpdate as jest.Mock).mockResolvedValueOnce({
            _id: '670d10e33ca6a0d02fc434a4',
            userId: 'userId123',
            theme: 'light',
            avatarURL: 'img.jpg',
            favorites: [{ _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100}}],
            history: [],
        })

        await userControllers.updateFavorites(
            req as any,
            res as any,
            next as any
        );

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Car added to favorites',
            arrFavorite: [{  _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100} }],
        })

    })

    test('should generate error if request doesnt have decoded userId', async () => {
        const req = {
            user: {},
            body: {
                _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100}
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await userControllers.updateFavorites(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user.jwtPayload` '
        )
    })
    test('should generate error if request doesnt have user property', async () => {
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await userControllers.updateFavorites(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user` '
        )
    })
    test('should generate error if request doesnt have car data(at list _id property)', async () => {
        const req = {
            user:  {
                jwtPayload: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
            body: {},
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await userControllers.updateFavorites(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            "Request body doesnt have car data to add to favorites"
        )
    })
    test('should return error if profile not found', async () => {
        const req = {
            user: {
                jwtPayload: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
            body: {
                _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100}
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn();

        (UserProfile.findOne as jest.Mock).mockResolvedValue(null);

        await userControllers.updateFavorites(req as any, res as any, next as any);

        expect(next).toHaveBeenCalledWith(new Error('Profile not found'));
    });
    test('should remove car from favorites if it exists', async () => {
        const req = {
            user: {
                jwtPayload: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            },
            body: {
                _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: "",
                availability: [],
                isRemoved: false,
                price: {hour: 10, day:100}
            },
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn();

        const mockProfile = {
             _id: '670d10e33ca6a0d02fc434a4',
            userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            theme: 'light',
            avatarURL: 'img.jpg',
            favorites: [{
                price: [Object],
                _id: '670d10e33ca6a0d02fc434a1',
                make: 'Jeep',
                model: 'Grand Cherokee',
                year: '2013',
                type: 'SUV',
                engine: 3,
                fuel: 'diesel',
                transmission: 'automatic',
                color: 'red',
                img: 'https://res.cloudinary.com/carsphoto/image/upload/v1728397548/cars/Jeep_Grand_Cherokee_red.jpg',
                availability: [],
                isRemoved: false
              }],
            history: [],
        };

        (UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile);
        (UserProfile.findOneAndUpdate as jest.Mock).mockResolvedValue({
            _id: '670d10e33ca6a0d02fc434a4',
            userId: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
            theme: 'light',
            avatarURL: 'img.jpg',
            favorites: [],
            history: [],
        });

        await userControllers.updateFavorites(req as any, res as any, next as any);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Car removed from favorites',
            arrFavorite: [],
        });
    });
})
