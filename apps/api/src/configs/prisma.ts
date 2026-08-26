import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/index.js";
import { env } from "./env.js";

const connectionString = env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });