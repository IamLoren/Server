import { Request, Response } from 'express'
import { Types } from 'mongoose'
const id: Types.ObjectId = new Types.ObjectId()

export interface signUpArguments {
    firstName: string
    lastName: string
    password: string
    email: string
    role: 'admin' | 'user'
    token?: string | null
}

export interface IUserCredentials {
    firstName: string
    lastName: string
    password: string
    email: string
    role: 'admin' | 'user'
    token: string | null
}

export interface RegisterRes extends Response {
    status: (statusCode: number) => this
    json: (body: {
        id: Types.ObjectId
        token: string | null
        firstName: string
        lastName: string
        email: string
        role: 'admin' | 'user'
    }) => this
}

export interface RegisterReq extends Request {
    body: signUpArguments
}

export interface signInReq extends Request {
    body: {
        email: string
        password: string
    }
}
export interface signInRes extends Response {
    status: (statusCode: number) => this
    json: (body: {
        token: string
        user: {
            firstName: string
            lastName: string
            email: string
            avatarURL: string | undefined
            theme: string | undefined
        }
    }) => this
}

export interface currentReq extends Request {
    body: {
        user:  {
            email: string
            avatarURL: string
            theme: string
        }
    }
}

export interface currentRes extends Response {
    status: (statusCode: number) => this
    json: (
        body: {
            email: string
            avatarURL: string
            theme: string
        }
    ) => this
}
