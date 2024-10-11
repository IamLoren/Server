import { Request, Response } from 'express';
import { Types } from 'mongoose';
export interface signUpArguments {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: "admin" | "user";
    token: string | null;
}
export interface IUserCredentials {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    role: 'admin' | 'user';
    token: string | null;
}
export interface RegisterRes extends Response {
    status: (statusCode: number) => this;
    json: (body: {
        id: Types.ObjectId;
        token: string | null;
        firstName: string;
        lastName: string;
        email: string;
        role: 'admin' | 'user';
    }) => this;
}
export interface RegisterReq extends Request {
    body: signUpArguments;
}
