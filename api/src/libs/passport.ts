import bcrypt from "bcryptjs";
import passport from "passport"
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GitHubStrategy, type Profile } from 'passport-github2';
import type { VerifyCallback } from 'passport-oauth2';
import { prisma } from "./prisma.js"
import { env } from "../schemas/env.schema.js";

passport.use(
    new GitHubStrategy({
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/github/callback"
    },
        async (_accessToken: string, _refreshToken: string, profile: Profile, cb: VerifyCallback) => {
            try {
                return cb(null, profile)
            } catch (err) {
                return cb(err)
            }
        }
    ));

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async (email, password, cb) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { email }
                });

                if (!user) {
                    return cb(null, false, {
                        message: "Email is not registered."
                    });
                }

                const match = await bcrypt.compare(password, user.password)

                if (!match) {
                    return cb(null, false, {
                        message: "Invalid password."
                    })
                }

                return cb(null, user, {
                    message: "Logged in successfully"
                });

            } catch (error) {
                return cb(error);
            }
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET_KEY,
        },
        async (jwtPayload, cb) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: jwtPayload.id,
                    },
                    select: {
                        id: true,
                        email: true,
                        username: true,
                    }
                });

                return user ? cb(null, user) : cb(null, false)

            } catch (error) {
                return cb(error);
            }
        }
    )
);

export { passport };