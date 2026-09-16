import type { GetLikesByPostIdResponse, LikePostResponse, UnlikePostResponse } from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import { GetLikesByPostIdSuccessSchema } from "@neetwork/contracts";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "../../../generated/prisma/runtime/client.js";
import { findLikesByPostId, insertLike, removeLike } from "./likes.service.js";

const PostParamsSchema = z.strictObject({
  postId: z.uuidv7(),
});

export async function getLikesByPostId(req: Request, res: Response<GetLikesByPostIdResponse>, next: NextFunction) {
  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  const { postId } = params.data;

  try {
    const likes = await findLikesByPostId(postId);

    const response = GetLikesByPostIdSuccessSchema.parse({
      success: true,
      likes,
    });

    return res.json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function likePost(req: Request, res: Response<LikePostResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await insertLike(req.user.id, params.data.postId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError
      && error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You can't like a post multiple times.",
      });
    }
    next(error);
  }
}

export async function unlikePost(req: Request, res: Response<UnlikePostResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await removeLike(req.user.id, params.data.postId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError
      && error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No record found." });
    }
    next(error);
  }
}
