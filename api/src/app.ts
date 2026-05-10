import cors from "cors";
import express, { json, urlencoded, type Express, type Request, type Response, type NextFunction } from "express";
import { authRouter } from "./routes/auth.router.js";

const app: Express = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: false }))

app.get("/", (_req, res) => res.json({ message: "Server is running..." }))
app.use("/auth", authRouter)

// TODO: Fix the Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err)
 })

export default app;