import express from "express";
import { getUserAccount, updateUserAccount } from "./account.controller.js";

export const accountRouter = express.Router();

accountRouter.get("/", getUserAccount);

accountRouter.patch("/", updateUserAccount);
