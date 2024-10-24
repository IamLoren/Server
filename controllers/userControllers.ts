import { Request, Response, NextFunction } from 'express'
import UserCredentials from '../models/UserCredentials'
import UserProfile from '../models/UserProfile'
import mongoose from 'mongoose'
import { boolean } from 'joi'

interface ReqInt extends Request {
    user: {jwtPayload: string}
}
interface ResInt extends Response {
    status: (code: number) => this;
    json: (body: {
        message?: string;  
        arrFavorite?: any[]; 
    }) => this; 
}

const updateFavorites = async (
    req: ReqInt,
    res: ResInt,
    next: NextFunction
) => {
    try {
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId);
        const carId = req.body._id
        const car = req.body
        const profile = await UserProfile.findOne({ userId: objectId })

        if (!profile) {
            throw new Error('Profile not found')
        }

        const carExists = profile.favorites.some(
            (favoriteCar) => favoriteCar._id === carId
        )

        if (carExists) {
            const updatedProfile  = await UserProfile.findOneAndUpdate(
                { userId: objectId },
                { $pull: { favorites: { _id: carId } } },
                { new: true }
            )
            if (updatedProfile) {
                res.status(200).json({
                    message: 'Car removed from favorites',
                    arrFavorite: updatedProfile.favorites,
                });
            }
        } else {
            const newFavorite = await UserProfile.findOneAndUpdate(
                { userId: objectId },
                { $push: { favorites: car } },
                { new: true }
            )
            if(newFavorite) {
                const arrFavorite =  newFavorite.favorites; 
            res.status(200).json({
                message: 'Car added to favorites',
                arrFavorite})
            }
        }
    } catch (error) {
        next(error);
    }
}

export default {
    updateFavorites,
}
