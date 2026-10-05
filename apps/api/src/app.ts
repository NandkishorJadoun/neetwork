import type { NextFunction, Request, Response } from "express";
import path from "node:path";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./configs/auth.js";
import { env } from "./configs/env.js";
import { httpLogger, logger } from "./configs/logger.js";
import { appRouter } from "./routes/index.js";

const app = express();

app.use(httpLogger);

if (env.NODE_ENV === "development") {
  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
}

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/health", (_req, res) => res.json({ message: env.NODE_ENV }));
app.use("/api/", appRouter);

app.get("/{*splat}", (_req, res, next) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"), (err) => {
    if (err)
      next(err);
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
