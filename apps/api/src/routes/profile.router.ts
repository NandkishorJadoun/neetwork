import express, { type Router } from "express"
import { upload } from "../configs/multer.js";
import { acceptFollowRequest, getAllFollowRequests, getUserProfile, rejectFollowRequest, removeFollower, updateUserProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "@/middlewares/require-auth.js";

export const profileRouter: Router = express.Router();

profileRouter.use(requireAuth)

profileRouter.get("/", getUserProfile)

profileRouter.patch("/", upload.single("avatar"), updateUserProfile)

profileRouter.get("/follow-requests", getAllFollowRequests)

profileRouter.patch("/follow-requests/:userId", acceptFollowRequest)

profileRouter.delete("/follow-requests/:userId", rejectFollowRequest)

profileRouter.delete("/followers/:userId", removeFollower)