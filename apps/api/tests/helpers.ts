import type { User } from "better-auth";
import type { TestHelpers } from "better-auth/plugins";
import { randomUUIDv7 } from "node:crypto";
import { betterAuth } from "better-auth";
import { testUtils } from "better-auth/plugins";
import { baseAuthConfig } from "../src/configs/auth.ts";
import { prisma } from "../src/configs/prisma.ts";

export const testAuth = betterAuth({
  ...(baseAuthConfig),
  plugins: [
    ...baseAuthConfig.plugins,
    testUtils(),
  ],
});

export async function clearDb() {
  await prisma.$transaction([
    prisma.follow.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.verification.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

export async function getCookieForUser(test: TestHelpers, userId: string) {
  const cookie = (await test.getAuthHeaders({ userId })).get("cookie");
  if (!cookie) {
    throw new Error("Cookie not found");
  }
  return cookie;
}

export async function setupTestUsers(count = 5) {
  await clearDb();

  const test = (await testAuth.$context).test;

  const users: User[] = await Promise.all(
    Array.from({ length: count }, (_, i) => {
      const n = i.toString();
      return test.saveUser(test.createUser({
        id: randomUUIDv7(),
        email: `user${n}@example.com`,
        name: `User ${n}`,
      }));
    }),
  );

  const cookie = await getCookieForUser(test, users[0].id);

  return { test, users, cookie };
}
