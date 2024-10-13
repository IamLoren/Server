import { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import * as authServices from '../services/authServices.js'
import {
    currentReq,
    currentRes,
    IUserCredentials,
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
        const jwtPayload = foundedUser.id
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

const getCurrent = async (req, res: currentRes, next: NextFunction) => {
    try {
        const id = req.user.jwtPayload
        const { JWT_SECRET } = process.env
        const jwtPayload = id
        const updatedToken = jwt.sign({ jwtPayload }, JWT_SECRET, { expiresIn: '12h' })
        const user = await UserCredentials.findByIdAndUpdate(
            id,
            { token: updatedToken },
            { new: true }
        )
        if (user) {
            const { _id, firstName, lastName, role, email} = user;
        const userProfile = await UserProfile.findOne({
            userId: _id,
        })
        if(userProfile) {
            res.status(200).json({
                id: _id.toString(),
                firstName,
                lastName,
                email,
                avatarURL: userProfile.avatarURL,
                theme: userProfile.theme,
                role,
                token:updatedToken,
        })
        }
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
