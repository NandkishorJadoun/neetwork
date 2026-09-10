import express from "express";

import { requireAuth } from "../middlewares/require-auth.js";
import { usersRouter } from "../modules/users/users.route.js";
import { accountRouter } from "../modules/account/account.route.js";
import { postsRouter } from "../modules/posts/posts.route.js";
import { likesRouter } from "../modules/likes/likes.route.js";
import { followsRouter } from "../modules/follows/follows.route.js";
import { commentsRouter } from "../modules/comments/comments.route.js";

export const appRouter = express.Router();

appRouter.use(requireAuth);

appRouter.use("/users", usersRouter);
appRouter.use("/account", accountRouter);
appRouter.use("/posts", postsRouter);
appRouter.use("/", likesRouter);
appRouter.use("/", followsRouter);
appRouter.use("/", commentsRouter);
