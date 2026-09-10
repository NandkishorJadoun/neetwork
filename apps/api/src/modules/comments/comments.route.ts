import express from "express"
import { createComment } from "./comments.controller.js";

export const commentsRouter = express.Router();

commentsRouter.post("/posts/:postId/comment", createComment)