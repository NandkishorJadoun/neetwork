import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CommentFormSchema } from "../../configs/schemas.js";
import { insertComment } from "./comments.service.js";

export async function createComment(req: Request, res: Response, next: NextFunction) {
  const { user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { content } = CommentFormSchema.parse(req.body);

    const comment = await insertComment(user.id, params.postId, content);

    return res.status(201).json({ comment });
  }
  catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        errors: error.issues.map(issue =>
          ({ fieldName: issue.path[0], message: issue.message }),
        ),
      });
    }
    next(error);
  }
}
