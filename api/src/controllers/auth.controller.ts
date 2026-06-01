import type { Profile } from "passport-github2";
import jwt from "jsonwebtoken";
import { env } from "../schemas/env.schema.js";
import type { NextFunction, Request, Response } from "express";
import { passport } from "../libs/passport.js";
import { prisma } from "../libs/prisma.js";

const guestUserInfo = {
    githubId: "619515",
    username: "guest",
    fullname: "Guest",
    avatar: "https://avatars.githubusercontent.com/u/619515",
    about: "This is a Guest Account"
}

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

export const getGuestLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await prisma.user.upsert({
            where: { username: "guest" },
            update: {},
            create: guestUserInfo,
            select: {
                id: true
            }
        })

        const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);
        return res.json({ token, id: user.id })
    } catch (error) {
        next(error)
    }
}