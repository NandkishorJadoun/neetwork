import passport from "passport"
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt"
import { Strategy as GitHubStrategy, type Profile } from 'passport-github2';
import type { VerifyCallback } from 'passport-oauth2';
import { prisma } from "./prisma.js"
import { env } from "../schemas/env.schema.js";

passport.use(
    new GitHubStrategy({
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: env.GITHUB_CALLBACK_URL,
    },
        async (_accessToken: string, _refreshToken: string, profile: Profile, cb: VerifyCallback) => {
            try {

                if (!profile.username) {
                    return cb(new Error("Username is undefined"))
                }

                const avatarUrl = `https://avatars.githubusercontent.com/u/${profile.id}`

                const user = await prisma.user.upsert({
                    where: { githubId: profile.id },
                    update: {},
                    create: {
                        githubId: profile.id,
                        username: profile.username,
                        fullname: profile.displayName,
                        avatar: avatarUrl,
                    },
                    select: {
                        id: true
                    }
                })

                return cb(null, user, {
                    message: "Logged in successfully"
                });

            } catch (err) {
                return cb(err)
            }
        }
    ));

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: env.JWT_SECRET_KEY,
        },
        async (jwtPayload, cb) => {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: jwtPayload.id, },
                    select: { id: true, }
                });

                return user ? cb(null, user) : cb(null, false)

            } catch (error) {
                return cb(error);
            }
        }
    )
);

export { passport };