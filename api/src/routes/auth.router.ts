import express, { Router } from "express"
import { passport } from "../configs/passport.js";
import { getGithubCallback, getGuestLogin } from "../controllers/auth.controller.js";

export const authRouter: Router = express.Router()

authRouter.get('/github',
    passport.authenticate('github', { session: false, scope: ['user:email'] }));

authRouter.get('/github/callback', getGithubCallback)

authRouter.get('/guest', getGuestLogin)