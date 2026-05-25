import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import type { Profile } from "passport-github2";
import jwt from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";

export const authRouter: Router = express.Router()

authRouter.get('/github',
    passport.authenticate('github', { session: false, scope: ['user:email'] }));

authRouter.get('/github/callback', async (req, res) => {
    passport.authenticate('github', { session: false },
        (err: unknown, user: Profile) => {
            if (err || !user) {
                return res.redirect(`${env.FRONTEND_URL}/auth`)
            }
            const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);
            return res.redirect(`${env.FRONTEND_URL}/login/callback?token=${token}&id=${user.id}`);
        })(req, res)
})