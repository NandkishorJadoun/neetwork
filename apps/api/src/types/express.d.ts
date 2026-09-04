import { type Session, type User } from "better-auth";

declare global {
    namespace Express {
        interface Request {
            session?: {
                session: Session;
                user: User;
            };
            user?: User;
        }
    }
}
