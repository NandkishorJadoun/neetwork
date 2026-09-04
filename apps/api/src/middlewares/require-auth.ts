import { auth } from "@/configs/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { type RequestHandler } from "express";

export const requireAuth: RequestHandler = async (req, res, next) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    req.session = session;
    req.user = session.user;
    next();
};