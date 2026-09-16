/// <reference types="node" />

import { existsSync } from "node:fs";
import process from "node:process";
import { defineConfig, env } from "prisma/config";

if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

process.loadEnvFile();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
