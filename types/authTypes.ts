import { Request, Response } from 'express'
import { ObjectId, Types } from 'mongoose'
const id: Types.ObjectId = new Types.ObjectId()

export interface signUpArguments {
    firstName: string
    lastName: string
    password: string
    email: string
    role: 'admin' | 'user'
    token?: string | null
    terms: boolean
}

export interface IUserCredentials {
    _id: ObjectId
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
        token: string | null
        user: {
            id: Types.ObjectId
            firstName: string
            lastName: string
            email: string
            role: 'admin' | 'user'
        }
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
            id: string
            firstName: string
            lastName: string
            email: string
            avatarURL: string | undefined
            favorites: {}[]
            history: {}[]
            theme: 'light' | 'dark'
            role: "user" | "admin"
        }
    }) => this
}

export interface currentReq extends Request {
    body: {      
    }
}

export interface currentRes extends Response {
    status: (statusCode: number) => this
    json: (body: {
        id: string
        firstName: string
        lastName: string
        email: string
        avatarURL: string
        theme: 'light' | 'dark'
        role: 'admin' | 'user'
        token: string
        favorites: {}[]
        history: {}[]
    }) => this
}

export interface LogoutReq extends Request {
    user: {
        jwtPayload: ObjectId
    }
}

export interface LogoutRes extends Response {
    status: (statusCode: number) => this
}
