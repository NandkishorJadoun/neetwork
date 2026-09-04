import { prisma } from "../configs/prisma.js";
import type { Request, Response, NextFunction } from "express";
import { CommentFormSchema, PostFormSchema } from "../configs/schemas.js";
import { ZodError, z } from "zod/v4";
import { Prisma } from "../../generated/prisma/index.js";
import {
  GetAllPostsSuccessSchema,
  GetLikesByPostIdSuccessSchema,
  GetPostByIdSuccessSchema,
  type DeletePostResponse,
  type GetAllPostsResponse,
  type GetLikesByPostIdResponse,
  type GetPostByIdResponse,
  type LikePostResponse,
  type UnlikePostResponse,
} from "@neetwork/contracts/schemas/posts.js";

const GetAllPostsQuerySchema = z.strictObject({
  cursor: z.cuid2().optional(),
  users: z.literal("following").optional(),
});

const PostParamsSchema = z.strictObject({
  postId: z.cuid2(),
});

export const getAllPosts = async (
  req: Request,
  res: Response<GetAllPostsResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.user;
  const { cursor, users } = GetAllPostsQuerySchema.parse(req.query);

  const LIMIT = 10;

  try {
    const posts = await prisma.post.findMany({
      ...(users
        ? {
          where: {
            OR: [
              {
                userId: id,
              },
              {
                author: {
                  followers: {
                    some: {
                      fromId: id,
                      status: "ACCEPTED",
                    },
                  },
                },
              },
            ],
          },
        }
        : {}),
      ...(cursor
        ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
        : {}),
      take: LIMIT,
      orderBy: {
        created_at: "desc",
      },
      include: {
        author: {
          select: {
            image: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: id,
          },
        },
      },
    });

    const hasNextPage = posts.length === LIMIT;
    const lastPost = posts.at(-1);

    const nextCursor = hasNextPage && lastPost ? lastPost.id : null;

    const response = GetAllPostsSuccessSchema.parse({
      success: true,
      posts,
      nextCursor,
    });

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const postForm = PostFormSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        text: postForm.content,
        userId: user.id,
      },
    });

    return res.status(201).json({ post });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        errors: error.issues.map((issue) =>
          Object({ fieldName: issue.path[0], message: issue.message }),
        ),
      });
    }
    next(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response<GetPostByIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id: userId } = req.user;
  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  const { postId } = params.data;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          orderBy: {
            created_at: "desc",
          },
          include: {
            author: {
              omit: {
                email: true,
                emailVerified: true,
                about: true,
                isAnonymous: true,
              },
            },
          },
        },
        author: {
          select: {
            image: true,
            name: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId,
          },
        },
      },
    });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const response = GetPostByIdSuccessSchema.parse({ success: true, post });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: Request,
  res: Response<DeletePostResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await prisma.post.delete({
      where: {
        id: params.data.postId,
        userId: req.user.id,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }
    next(error);
  }
};

export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { body, user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" });
  }

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const commentForm = CommentFormSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        text: commentForm.content,
        userId: user.id,
        postId: params.postId,
      },
    });

    return res.status(201).json({ comment });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        errors: error.issues.map((issue) =>
          Object({ fieldName: issue.path[0], message: issue.message }),
        ),
      });
    }
    next(error);
  }
};

export const getLikesByPostId = async (
  req: Request,
  res: Response<GetLikesByPostIdResponse>,
  next: NextFunction,
) => {
  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  const { postId } = params.data;

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });

    const response = GetLikesByPostIdSuccessSchema.parse({
      success: true,
      likes,
    });

    return res.json(response);
  } catch (error) {
    next(error);
  }
};

export const likePost = async (
  req: Request,
  res: Response<LikePostResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId: params.data.postId,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You can't like a post multiple times.",
      });
    }
    next(error);
  }
};

export const unlikePost = async (
  req: Request,
  res: Response<UnlikePostResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = PostParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid Post ID" });
  }

  try {
    await prisma.like.delete({
      where: {
        userId_postId: { userId: req.user.id, postId: params.data.postId },
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No record found." });
    }
    next(error);
  }
};
