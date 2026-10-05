import type { NextFunction, Request, Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./configs/auth.js";
import { env } from "./configs/env.js";
import { httpLogger, logger } from "./configs/logger.js";
import { appRouter } from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Works both in dev (src/) and prod (dist/): apps/api/src -> apps/api/public, apps/api/dist -> apps/api/public
const publicPath = path.resolve(__dirname, "../public");

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

// Serve Vite static build (JS/CSS/assets). Must come before SPA fallback,
// otherwise /assets/* would return index.html.
app.use(express.static(publicPath));

app.get("/{*splat}", (req, res, next) => {
  // Let unknown /api/* fall through as JSON 404 instead of HTML.
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ message: "Not Found" });
    return;
  }
  res.sendFile(path.join(publicPath, "index.html"), (err) => {
    if (err)
      next(err);
  });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
