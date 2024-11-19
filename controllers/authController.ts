import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authServices from '../services/authServices'
import {
    currentReq,
    currentRes,
    LogoutReq,
    LogoutRes,
    RegisterReq,
    RegisterRes,
    signInReq,
    signInRes,
} from '../types/authTypes'
import HttpError from '../services/HTTPError'
import UserProfile from '../models/UserProfile'
import UserCredentials from '../models/UserCredentials'

const register = async (
    req: RegisterReq,
    res: RegisterRes,
    next: NextFunction
) => {
    try {
        const { email, password, firstName, lastName } = req.body
        if (!email || !password || !firstName || !lastName) {
            throw new Error(
                'Email, password, firstName and lastName are required'
            )
        }

        const user = await authServices.findUser({ email })
        if (user) {
            throw HttpError(409, 'Email in use')
        }

        const newUser = await authServices.signUp({ ...req.body })
        if (!newUser) {
            throw new Error('Registration error')
        }

        const newUserProfile = new UserProfile({
            userId: newUser._id,
        })
        await newUserProfile.save()

        const { JWT_SECRET } = process.env
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET variable is not available')
        }
        const jwtPayload = newUser._id
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })

        res.status(201).json({
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
            },
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req: signInReq, res: signInRes, next: NextFunction) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new Error('Email and password  are required')
        }

        const foundedUser = await authServices.findUser({ email })
        if (!foundedUser) {
        return res.status(404)
        }

        const passwordCompare = await bcrypt.compare(
            password,
            foundedUser.password
        )
        if (!passwordCompare) {
           return res.status(401);
        }

        const { JWT_SECRET } = process.env
        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET variable is not available')
        }
        const jwtPayload = foundedUser._id
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })

        const userProfile = await UserProfile.findOne({
            userId: foundedUser._id,
        })
        if (!userProfile) {
            throw new Error('User profile was not founded')
        }

        if (userProfile) {
            res.json({
                token,
                user: {
                    id: foundedUser._id.toString(),
                    email: foundedUser.email,
                    firstName: foundedUser.firstName,
                    lastName: foundedUser.lastName,
                    role: foundedUser.role,
                    theme: userProfile.theme,
                    avatarURL: userProfile.avatarURL,
                    favorites: userProfile.favorites,
                    history: userProfile.history,
                },
            })
        }
    } catch (error) {
        next(error)
    }
}

const getCurrent = async (req, res: currentRes, next: NextFunction) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }

        const id = req.user.jwtPayload

        const user = await UserCredentials.findOne({ _id: id })
        if (!user) {
            throw new Error('User with such id was not fouded')
        }

        if (user) {
            const { _id, firstName, lastName, role, email, token } = user

            const foundedUserProfile = await UserProfile.findOne({
                userId: _id,
            })
            if (!foundedUserProfile) {
                throw new Error('User profile was not founded')
            }

            if (foundedUserProfile) {
                const { avatarURL, theme, favorites, history } =
                    foundedUserProfile
                res.status(200).json({
                    id: _id.toString(),
                    firstName,
                    lastName,
                    email,
                    avatarURL,
                    theme,
                    favorites,
                    history,
                    role,
                    token,
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

const logout = async (req: LogoutReq, res: LogoutRes, next: NextFunction) => {
    try {
        if (!req.hasOwnProperty('user')) {
            throw new Error('Request doesnt have necessary property `user` ')
        }
        if (!req.user.hasOwnProperty('jwtPayload')) {
            throw new Error(
                'Request doesnt have necessary property `user.jwtPayload` '
            )
        }

        const id = req.user.jwtPayload
        await authServices.setToken(id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

export default {
    register,
    login,
    getCurrent,
    logout,
}
