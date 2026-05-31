import type { Profile } from "passport-github2";
import jwt from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";
import type { Request, Response } from "express";
import { passport } from "../libs/passport.js";

export const getGithubCallback = async (req: Request, res: Response) => {
    passport.authenticate('github', { session: false },
        (err: unknown, user: Profile) => {
            if (err || !user) {
                return res.redirect(`${env.FRONTEND_URL}/auth`)
            }
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);
            return res.redirect(`${env.FRONTEND_URL}/login/callback?token=${token}&id=${user.id}`);
        })(req, res)
} 