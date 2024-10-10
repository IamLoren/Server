import { NextFunction, Request, Response } from 'express';
import { signUpArguments } from '../types/authTypes.js';
interface RegisterReq extends Request {
    body: signUpArguments;
}
interface RegisterRes extends Response {
    status: (statusCode: number) => this;
    json: (body: {
        firstName: string;
        lastName: string;
        email: string;
        role: 'admin' | 'user';
    }) => this;
}
declare const _default: {
    register: (req: RegisterReq, res: RegisterRes, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
