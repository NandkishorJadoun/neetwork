import express, { Router } from "express"
import { passport } from "../configs/passport.js";
import { createComment, createPost, deletePost, getAllPosts, getPostById, getLikesByPostId,likePost, unlikePost } from "../controllers/posts.controller.js";

export const postsRouter: Router = express.Router();

postsRouter.use(passport.authenticate("jwt", { session: false }))

postsRouter.get("/", getAllPosts)

postsRouter.post("/", createPost)

postsRouter.get("/:postId", getPostById)

postsRouter.delete("/:postId", deletePost)

postsRouter.post("/:postId", createComment)

postsRouter.get("/:postId/likes" ,getLikesByPostId)

postsRouter.post("/:postId/like", likePost)

postsRouter.delete("/:postId/like", unlikePost)