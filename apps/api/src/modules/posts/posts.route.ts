import express from "express"
import { createPost, deletePost, getAllPosts, getPostById } from "./posts.controller.js";

export const postsRouter = express.Router();

postsRouter.get("/", getAllPosts)

postsRouter.post("/", createPost)

postsRouter.get("/:postId", getPostById)

postsRouter.delete("/:postId", deletePost)