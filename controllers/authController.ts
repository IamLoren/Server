import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import * as authServices from '../services/authServices.js'
import { signUpArguments } from '../types/authTypes.js'
import HttpError from '../services/HTTPError.js'

interface RegisterReq extends Request {
    body: signUpArguments
}

interface RegisterRes extends Response {
    status: (statusCode: number) => this
    json: (body: {
        // token: string | null;
        firstName: string
        lastName: string
        email: string
        role: 'admin' | 'user'
    }) => this
}

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

        const newUser = await authServices.signUp(req.body)
        await newUser.save()

        res.status(201).json({
            // token,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        })
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body

        const user = await authServices.findUser({ email })
        if (!user) {
            throw HttpError(401, 'Invalid email or password')
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            throw HttpError(401, 'Invalid email or password')
        }

        // const token = await sign(user);

        // res.json({
        //   token,
        //   user: {
        //     email,
        //     createdAt: user.createdAt,
        //     theme: user.theme,
        //     avatarURL: user.avatarURL,
        //   },
        // });
    } catch (error) {
        next(error)
    }
}

export default {
    register,
    login,
}
