import express from "express"
import { deleteFollowRequest, getAllNonFollowingUsers, getCommentsByUserId, getFollowersByUserId, getFollowingsByUserId, getLikedPostsByUserId, getPostsByUserId, getUserById, removeFollowerByUserId, sendFollowRequest } from "../controllers/users.controller.js";
import { requireAuth } from "@/middlewares/require-auth.js";

export const usersRouter = express.Router();

usersRouter.use(requireAuth)

usersRouter.get("/", getAllNonFollowingUsers)

usersRouter.get("/:userId", getUserById)

usersRouter.get("/:userId/posts", getPostsByUserId)

usersRouter.get("/:userId/comments", getCommentsByUserId)

usersRouter.get("/:userId/likes", getLikedPostsByUserId)

usersRouter.get("/:userId/followers", getFollowersByUserId)

usersRouter.get("/:userId/followings", getFollowingsByUserId)

usersRouter.post("/:userId/follow-request", sendFollowRequest)

usersRouter.delete("/:userId/follow-request", deleteFollowRequest)

usersRouter.delete("/:userId/follow", removeFollowerByUserId)
