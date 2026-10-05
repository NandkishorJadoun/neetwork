import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { anonymous } from "better-auth/plugins";
import { env } from "./env.js";
import { prisma } from "./prisma.js";

export const baseAuthConfig = {
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins:
    env.NODE_ENV === "production"
      ? [env.BETTER_AUTH_URL, "https://*.vercel.app"]
      : ["http://localhost:5173", "http://localhost:3000", env.BETTER_AUTH_URL],
  advanced: {
    database: {
      generateId: false,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    anonymous(),
  ],
} satisfies BetterAuthOptions;

export const auth = betterAuth(baseAuthConfig);
