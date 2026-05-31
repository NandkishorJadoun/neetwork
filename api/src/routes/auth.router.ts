import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { getGithubCallback } from "../controllers/auth.controller.js";


export const authRouter: Router = express.Router()

authRouter.get('/github',
    passport.authenticate('github', { session: false, scope: ['user:email'] }));

authRouter.get('/github/callback', getGithubCallback)