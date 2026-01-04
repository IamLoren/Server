import { Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            user?: {
                jwtPayload: string
            }
        }
    }
}

export {}

