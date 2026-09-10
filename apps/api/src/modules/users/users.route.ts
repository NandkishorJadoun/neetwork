import express from "express"
import {
  getAllNonFollowingUsers,
  getCommentsByUserId,
  getFollowersByUserId,
  getFollowingsByUserId,
  getLikedPostsByUserId,
  getPostsByUserId,
  getUserById
} from "./users.controller.js";

export const usersRouter = express.Router();

usersRouter.get("/", getAllNonFollowingUsers)

usersRouter.get("/:userId", getUserById)

usersRouter.get("/:userId/posts", getPostsByUserId)

usersRouter.get("/:userId/comments", getCommentsByUserId)

usersRouter.get("/:userId/likes", getLikedPostsByUserId)

usersRouter.get("/:userId/followers", getFollowersByUserId)

usersRouter.get("/:userId/followings", getFollowingsByUserId)
