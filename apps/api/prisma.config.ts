/// <reference types="node" />

import { defineConfig } from "prisma/config";
import { env } from "./src/configs/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env.DATABASE_URL,
  },
});
