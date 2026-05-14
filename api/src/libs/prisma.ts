import "dotenv/config";
import { env } from "../schemas/env.schema.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = env.NODE_ENV === 'test'
    ? process.env.TEST_DATABASE_URL
    : env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };