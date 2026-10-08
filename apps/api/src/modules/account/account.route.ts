import express from "express";
import { getAvatarSignature, getUserAccount, updateUserAccount } from "./account.controller.js";

export const accountRouter = express.Router();

accountRouter.get("/", getUserAccount);

accountRouter.post("/avatar-signature", getAvatarSignature);

accountRouter.patch("/", updateUserAccount);
