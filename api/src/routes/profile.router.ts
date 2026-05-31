import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { upload } from "../libs/multer.js";
import { acceptFollowRequest, getAllFollowRequests, getUserProfile, rejectFollowRequest, removeFollower, updateUserProfile } from "../controllers/profile.controller.js";

export const profileRouter: Router = express.Router();

profileRouter.use(passport.authenticate("jwt", { session: false }))

profileRouter.get("/", getUserProfile)

profileRouter.patch("/", upload.single("avatar"), updateUserProfile)

profileRouter.get("/follow-requests", getAllFollowRequests)

profileRouter.patch("/follow-requests/:userId", acceptFollowRequest)

profileRouter.delete("/follow-requests/:userId", rejectFollowRequest)

profileRouter.delete("/followers/:userId", removeFollower)