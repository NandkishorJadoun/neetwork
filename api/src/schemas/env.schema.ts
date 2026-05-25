import * as z from "zod";
import 'dotenv/config'

const envVariables = z.object({
    NODE_ENV: z.string(),
    PORT: z.coerce.number(),
    DATABASE_URL: z.string(),
    JWT_SECRET_KEY: z.string(),
    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    FRONTEND_URL: z.string()
})

export const env = envVariables.parse(process.env)