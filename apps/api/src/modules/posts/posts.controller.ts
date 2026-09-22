import type {
  CreatePostResponse,
  DeletePostResponse,
  GetAllPostsResponse,
  GetPostByIdResponse,
} from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import {
  CreatePostInputSchema,
  CreatePostSuccessSchema,
  GetAllPostsSuccessSchema,
  GetPostByIdSuccessSchema,
  PostIdParamsSchema,
  toFieldErrors,
} from "@neetwork/contracts";
import { z } from "zod/v4";
import { Prisma } from "../../../generated/prisma/index.js";
import { findAllPost, findPostById, insertPost, removePostById } from "./posts.service.js";

const GetAllPostsQuerySchema = z.strictObject({
  cursor: z.uuidv7().optional(),
  users: z.literal("following").optional(),
});

export async function getAllPosts(req: Request, res: Response<GetAllPostsResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id: userId } = req.user;
  const { cursor, users: followingUsersTab } = GetAllPostsQuerySchema.parse(req.query);

  const LIMIT = 10;

  try {
    const rawPosts = await findAllPost(userId, LIMIT, Boolean(followingUsersTab), cursor);

    const posts = rawPosts.map(({ likes, ...post }) => ({
      ...post,
      is_liked_by_user: likes.length > 0,
    }));

    const hasNextPage = posts.length === LIMIT;
    const lastPost = posts.at(-1);

    const nextCursor = hasNextPage && lastPost ? lastPost.id : null;

    const response = GetAllPostsSuccessSchema.parse({
      success: true,
      posts,
      nextCursor,
    });

    res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function createPost(req: Request, res: Response<CreatePostResponse>, next: NextFunction) {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const { content } = CreatePostInputSchema.parse(req.body);

    const post = await insertPost(user.id, content);

    const response = CreatePostSuccessSchema.parse({
      success: true,
      post,
    });

    return res.status(201).json(response);
  }
  catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(422).json({
        errors: toFieldErrors(error.issues),
      });
    }
    next(error);
  }
}

export async function getPostById(req: Request, res: Response<GetPostByIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id: userId } = req.user;
  const params = PostIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid Post ID" });
  }

  const { postId } = params.data;

  try {
    const rawPost = await findPostById(userId, postId);

    if (!rawPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const { likes, ...rest } = rawPost;

    const post = {
      ...rest,
      is_liked_by_user: likes.length > 0,
    };

    const response = GetPostByIdSuccessSchema.parse({ success: true, post });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function deletePost(req: Request, res: Response<DeletePostResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostIdParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await removePostById(req.user.id, params.data.postId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }
    next(error);
  }
}
