import { Request, Response, NextFunction } from 'express'
import UserCredentials from '../models/UserCredentials'
import UserProfile from '../models/UserProfile'
import mongoose from 'mongoose'
import { boolean } from 'joi'

interface ReqInt extends Request {
    user: { jwtPayload: string }
    body: { _id: string }
}
interface ResInt extends Response {
    status: (code: number) => this
    json: (body: {
        message?: string

        arrFavorite?: any[]
    }) => this
}

const updateFavorites = async (
    req: ReqInt,
    res: ResInt,
    next: NextFunction
) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId)
        const carId = req.body._id
        if (!carId) {
            throw new Error(
                'Request body doesnt have car data to add to favorites'
            )
        }

        const car = req.body
        const profile = await UserProfile.findOne({ userId: objectId })

        if (!profile) {
            throw new Error('Profile not found')
        }

        const carExists = profile.favorites.some(
            (favoriteCar) => favoriteCar._id === carId
        )

        if (carExists) {
            const updatedProfile = await UserProfile.findOneAndUpdate(
                { userId: objectId },
                { $pull: { favorites: { _id: carId } } },
                { new: true }
            )
            if (updatedProfile) {
                res.status(200).json({
                    message: 'Car removed from favorites',
                    arrFavorite: updatedProfile.favorites,
                })
            }
        } else if (!carExists) {
            const newFavorite = await UserProfile.findOneAndUpdate(
                { userId: objectId },
                { $push: { favorites: car } },
                { new: true }
            )
            if (newFavorite) {
                const arrFavorite = newFavorite.favorites
                res.status(200).json({
                    message: 'Car added to favorites',
                    arrFavorite,
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

const deleteUserController = async (req, res, next) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload;
        const objectId = new mongoose.Types.ObjectId(userId)

        await UserCredentials.deleteOne({ _id: objectId });
        await UserProfile.deleteOne({ userId: objectId });
        return res.status(200).json({ message: 'User and profile deleted successfully' });
    } catch (error) {
        next(error);
        return res.status(500).json({ message: 'Error deleting user and profile', error });
    }
}

export default {
    updateFavorites,
    deleteUserController,
}
