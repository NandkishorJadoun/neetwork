import express from "express";
import { upload } from "../../configs/multer.js";
import { getUserAccount, updateUserAccount } from "./account.controller.js";

export const accountRouter = express.Router();

accountRouter.get("/", getUserAccount)

accountRouter.patch("/", upload.single("avatar"), updateUserAccount)
