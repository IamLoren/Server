import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import * as authServices from '../services/authServices.js'
import {
    currentReq,
    currentRes,
    RegisterReq,
    RegisterRes,
    signInReq,
    signInRes,
} from '../types/authTypes.js'
import HttpError from '../services/HTTPError.js'
import UserProfile from '../models/UserProfile.js'

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

        const { JWT_SECRET } = process.env
        const jwtPayload = nanoid()
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })

        const newUser = await authServices.signUp({ ...req.body, token })

        const newUserProfile = new UserProfile({
            userId: newUser._id,
        })
        await newUserProfile.save()

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
        console.log(`foundedUser: ${foundedUser}`)

        const { JWT_SECRET } = process.env
        const jwtPayload = nanoid()
        const token = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })

        const userProfile = await UserProfile.findOne({
            userId: foundedUser._id,
        })
        if (userProfile) {
            res.json({
                token,
                user: {
                    email: foundedUser.email,
                    firstName: foundedUser.firstName,
                    lastName: foundedUser.lastName,
                    theme: userProfile.theme,
                    avatarURL: userProfile.avatarURL,
                },
            })
        }
    } catch (error) {
        next(error)
    }
}

const getCurrent = async (
    req: currentReq,
    res: currentRes,
    next: NextFunction
) => {
    try {
        const { id, firstName, lastName, role, email, avatarURL, theme } = req.body.user;
        const userProfile = await UserProfile.findOne({
            userId: id,
        })
        if(userProfile) {
            res.status(200).json({
                id,
                firstName,
                lastName,
                email,
                avatarURL: userProfile.avatarURL,
                theme: userProfile.theme,
                role,
        })
        }
    } catch (error) {
        next(error)
    }
}

const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id } = req.body.user
        await authServices.setToken(_id)
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
