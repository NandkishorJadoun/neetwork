import express from "express"
import {
  acceptFollowRequest,
  getAllFollowRequests,
  rejectFollowRequest,
  removeFollower,
  sendFollowRequest,
  unfollowUserById
} from "./follows.controller.js";

export const followsRouter = express.Router();

followsRouter.post("/follow/:userId", sendFollowRequest)

followsRouter.delete("/follow/:userId", unfollowUserById)

followsRouter.get("/follow-requests", getAllFollowRequests)

followsRouter.patch("/follow-requests/:userId", acceptFollowRequest)

followsRouter.delete("/follow-requests/:userId", rejectFollowRequest)

followsRouter.delete("/followers/:userId", removeFollower)
