import { testUtils } from "better-auth/plugins"
import { baseAuthConfig } from "../src/configs/auth.ts";
import { betterAuth } from "better-auth";
import { randomUUIDv7 } from "node:crypto";
import { prisma } from "../src/configs/prisma.ts";
import type { TestHelpers } from "better-auth/plugins";
import type { User } from "better-auth";

export const testAuth = betterAuth({
	...(baseAuthConfig),
	plugins: [
		...baseAuthConfig.plugins,
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

export const getCookieForUser = async (test: TestHelpers, userId: string) => {
  const cookie = (await test.getAuthHeaders({ userId })).get("cookie")
  if (!cookie) {
    throw new Error("Cookie not found");
  }
  return cookie;
}

export const setupTestUsers = async (count = 5) => {
  await clearDb()

  const test = (await testAuth.$context).test

  const users: User[] = await Promise.all(
    Array.from({ length: count }, (_, i) => {
      const n = i.toString();
      return test.saveUser(test.createUser({
        id: randomUUIDv7(),
        email: `user${n}@example.com`,
        name: `User ${n}`
      }))
    })
  )

  const cookie = await getCookieForUser(test, users[0].id)

  return { test, users, cookie };
}
