import express, { Router } from "express"
import passport from "passport";

export const authRouter: Router = express.Router()

authRouter.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

authRouter.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });
