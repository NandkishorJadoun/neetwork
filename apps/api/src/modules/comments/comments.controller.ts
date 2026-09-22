import type { CreateCommentResponse } from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import {
  CreateCommentInputSchema,
  CreateCommentSuccessSchema,
  PostIdParamsSchema,
  toFieldErrors,
} from "@neetwork/contracts";
import { z } from "zod/v4";
import { Prisma } from "../../../generated/prisma/index.js";
import { insertComment } from "./comments.service.js";

export async function createComment(req: Request, res: Response<CreateCommentResponse>, next: NextFunction) {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    const { content } = CreateCommentInputSchema.parse(req.body);

    const comment = await insertComment(user.id, params.data.postId, content);

    const response = CreateCommentSuccessSchema.parse({
      success: true,
      comment,
    });

    return res.status(201).json(response);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        errors: toFieldErrors(error.issues),
      });
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2003"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    next(error);
  }
}
