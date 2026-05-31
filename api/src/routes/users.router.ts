import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { deleteFollowRequest, getAllNonFollowingUsers, getCommentsByUserId, getFollowersByUserId, getFollowingsByUserId, getPostsByUserId, getUserById, removeFollowerByUserId, sendFollowRequest } from "../controllers/users.controller.js";

export const usersRouter: Router = express.Router();

usersRouter.use(passport.authenticate("jwt", { session: false }))

usersRouter.get("/", getAllNonFollowingUsers)

usersRouter.get("/:userId", getUserById)

usersRouter.get("/:userId/posts", getPostsByUserId)

usersRouter.get("/:userId/comments", getCommentsByUserId)

usersRouter.get("/:userId/followers", getFollowersByUserId)

usersRouter.get("/:userId/followings", getFollowingsByUserId)

usersRouter.post("/:userId/follow-request", sendFollowRequest)

usersRouter.delete("/:userId/follow-request", deleteFollowRequest)

usersRouter.delete("/:userId/follow", removeFollowerByUserId)
