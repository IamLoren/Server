import { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authServices from '../services/authServices.js'
import {
    currentReq,
    currentRes,
    LogoutReq,
    LogoutRes,
    RegisterReq,
    RegisterRes,
    signInReq,
    signInRes,
} from '../types/authTypes.js'
import HttpError from '../services/HTTPError.js'
import UserProfile from '../models/UserProfile.js'
import UserCredentials from '../models/UserCredentials.js'

const register = async (
    req: RegisterReq,
    res: RegisterRes,
    next: NextFunction
) => {
    try {
        const { email } = req.body

        const user = await authServices.findUser({ email })
        if (user) {
            throw HttpError(409, 'Email in use')
        }

        const newUser = await authServices.signUp({ ...req.body })

        const newUserProfile = new UserProfile({
            userId: newUser._id,
        })
        await newUserProfile.save()
        const { JWT_SECRET } = process.env
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

        const foundedUser = await authServices.findUser({ email })
        if (!foundedUser) {
            throw HttpError(401, 'Invalid email or password')
        }
        const passwordCompare = await bcrypt.compare(
            password,
            foundedUser.password
        )
        if (!passwordCompare) {
            throw HttpError(401, 'Invalid email or password')
        }

        const { JWT_SECRET } = process.env
        const jwtPayload = foundedUser._id
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })

        const userProfile = await UserProfile.findOne({
            userId: foundedUser._id,
        })
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
                },
            })
        }
    } catch (error) {
        next(error)
    }
}

const getCurrent = async (req, res: currentRes, next: NextFunction) => {
    try {
        const id = req.user.jwtPayload

        const user = await UserCredentials.findOne({ _id: id })

        if (user) {
            const { _id, firstName, lastName, role, email, token } = user

            const foundedUserProfile = await UserProfile.findOne({
                userId: _id,
            })

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
