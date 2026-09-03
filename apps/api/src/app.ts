import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import multer from "multer";
import path from "path";
import { auth } from "./configs/auth.js";
import { toNodeHandler } from "better-auth/node";
import { env } from "./configs/env.js";
import { httpLogger, logger } from "./configs/logger.js";
import { usersRouter } from "./routes/users.router.js";
import { profileRouter } from "./routes/profile.router.js";
import { postsRouter } from "./routes/posts.router.js";
import { UploadValidationError } from "./configs/multer.js";

const publicPath = path.join(process.cwd(), 'public');

const app = express()

app.use(express.static(publicPath));

app.use(httpLogger);
app.use(helmet());

app.all("/api/auth/*splat", toNodeHandler(auth));

if (env.NODE_ENV === "development") {
    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/api/health", (_req, res) => res.json({ message: "Server is running..." }))
app.use("/api/users", usersRouter)
app.use("/api/me", profileRouter)
app.use("/api/posts", postsRouter)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError || err instanceof UploadValidationError) {
        const { field, message } = err
        const status = err instanceof UploadValidationError ? 415 : 400
        return res.status(status).json({ errors: [{ fieldName: field, message }] })
    }

    logger.error(err)
    res.status(500).json({ message: "Internal Server Error" })
})

app.get('*splat', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;