import type { Request } from 'express'

declare global {
    namespace Express {
        interface User {
            id: string,
        }
    }
}

export interface AuthRequest extends Request {
    user: Express.User
}