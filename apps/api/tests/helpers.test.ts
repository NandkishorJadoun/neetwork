import { testUtils } from "better-auth/plugins"
import { baseAuthConfig } from "../src/configs/auth.ts";
import { betterAuth } from "better-auth";
import { prisma } from "../src/configs/prisma.ts";

export const testAuth = betterAuth({
	...(baseAuthConfig),
	plugins: [
		...(baseAuthConfig.plugins ?? []),
		testUtils(),
	],
})

export const clearDb = async () => {
  await prisma.$transaction([
    prisma.follow.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ])
}