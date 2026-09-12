import express from "express";
import { getLikesByPostId, likePost, unlikePost } from "./likes.controller.js";

export const likesRouter = express.Router();

likesRouter.get("/posts/:postId/likes", getLikesByPostId)

likesRouter.post("/posts/:postId/like", likePost)

likesRouter.delete("/posts/:postId/like", unlikePost)