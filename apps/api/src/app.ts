import cors from "cors";
import express, { json, urlencoded, type Express, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { authRouter } from "./routes/auth.router.js";
import { usersRouter } from "./routes/users.router.js";
import { profileRouter } from "./routes/profile.router.js";
import { postsRouter } from "./routes/posts.router.js";
import { UploadValidationError } from "./configs/multer.js";

const app: Express = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.get("/", (_req, res) => res.json({ message: "Server is running..." }))
app.use("/auth", authRouter)
app.use("/users", usersRouter)
app.use("/me", profileRouter)
app.use("/posts", postsRouter)

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof multer.MulterError || err instanceof UploadValidationError) {
        const { field, message } = err
        const status = err instanceof UploadValidationError ? 415 : 400
        return res.status(status).json({ errors: [{ fieldName: field, message }] })
    }

    console.error("[Error Handler]", err)
    res.status(500).json({ message: "Internal Server Error" })
})

export default app;