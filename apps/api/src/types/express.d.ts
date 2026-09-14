import type { Session, User } from "better-auth";

declare global {
  namespace Express {
    // eslint-disable-next-line ts/consistent-type-definitions
    interface Request {
      session?: {
        session: Session;
        user: User;
      };
      user?: User;
    }
  }
}
