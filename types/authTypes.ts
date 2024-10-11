import {Request, Response } from 'express';
 
export interface signUpArguments {
    firstName: string,
    lastName: string,
    password: string,
    email: string,
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
    status: (statusCode: number) => this
    json: (body: {
        token: string | null;
        firstName: string
        lastName: string
        email: string
        role: 'admin' | 'user'
    }) => this
}

export interface RegisterReq extends Request {
    body: signUpArguments
}