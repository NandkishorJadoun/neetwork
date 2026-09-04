import express from "express"
import { createComment, createPost, deletePost, getAllPosts, getPostById, getLikesByPostId,likePost, unlikePost } from "@/controllers/posts.controller.js";
import { requireAuth } from "@/middlewares/require-auth.js";

export const postsRouter = express.Router();

postsRouter.use(requireAuth)

postsRouter.get("/", getAllPosts)

postsRouter.post("/", createPost)

postsRouter.get("/:postId", getPostById)

postsRouter.delete("/:postId", deletePost)

postsRouter.post("/:postId", createComment)

postsRouter.get("/:postId/likes" ,getLikesByPostId)

postsRouter.post("/:postId/like", likePost)

postsRouter.delete("/:postId/like", unlikePost)