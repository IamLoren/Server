import { NextFunction, Request, Response } from 'express';
import { RegisterReq, RegisterRes } from '../types/authTypes.js';
declare const _default: {
    register: (req: RegisterReq, res: RegisterRes, next: NextFunction) => Promise<void>;
    login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCurrent: (req: any, res: any) => Promise<void>;
};
export default _default;
