import { Request, Response, NextFunction } from 'express'
import UserCredentials from '../models/UserCredentials'
import UserProfile from '../models/UserProfile'
import mongoose from 'mongoose'
import { boolean } from 'joi'

interface ReqInt extends Request {
    user?: { jwtPayload: string }
    body: { _id: string }
}
interface ResInt extends Response {
    status: (code: number) => this
    json: (body: {
        message?: string

        arrFavorite?: any[]
    }) => this
}

const getAllUsers = async (req: ReqInt, res: Response, next: NextFunction) => {
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
            throw new Error('admin with such id doesnt exist')
        }
        if (user.role === 'admin') {
            const allUsers = await UserCredentials.find()
            res.status(200).json({
                allUsers,
            })
        } else {
            res.status(403).end()
        }
    } catch (error) {
        next(error)
    }
}

const getOneUser = async (req, res, next) =>{
    const param = req.params.id;
    console.log(req.params.id)
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
        const user = await UserCredentials.findOne({ _id: objectId })

        if (!user) {
           return res.status(404).json({message: 'admin with such id doesnt exist'})
        }
        if (user.role === 'admin') { 
            const client = await UserCredentials.findById(param);
            if(client) {
                 res.status(200).json({
                client,
            })
            } else {
                return res.status(404).end();
            }
        } else {
            return res.status(403).end();
        }
    } catch (error) {
        next(error)
    }
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
        if (!req.user?.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }
        const userId = req.user.jwtPayload
        const objectId = new mongoose.Types.ObjectId(userId)
        const carId = req.body._id
        if (!carId) {
            return res.status(400).json({
                message: "Request body doesn't contain carId to add to favorites",
            });
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
        const idForDeletion = req.params.userId;
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }

        const objectId = new mongoose.Types.ObjectId(idForDeletion)

       const deleteCredentials = await UserCredentials.deleteOne({ _id: objectId })
       const deleteProfile = await UserProfile.deleteOne({ userId: objectId })

       return res
            .status(200)
            .json({ message: 'User and profile deleted successfully' })
    } catch (error) {
        next(error)
        return res
            .status(500)
            .json({ message: 'Error deleting user and profile', error })
    }
}

export default {
    getAllUsers,
    updateFavorites,
    deleteUserController,
    getOneUser
}
