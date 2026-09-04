import { prisma } from "../configs/prisma.js";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod/v4";
import { Prisma } from "../../generated/prisma/index.js";
import {
  GetAllNonFollowingUsersSuccessSchema,
  GetCommentsByUserIdSuccessSchema,
  GetFollowersByUserIdSuccessSchema,
  GetFollowingsByUserIdSuccessSchema,
  GetLikedPostsByUserIdSuccessSchema,
  GetPostsByUserIdSuccessSchema,
  GetUserByIdSuccessSchema,
  type DeleteFollowRequestResponse,
  type GetAllNonFollowingUsersResponse,
  type GetCommentsByUserIdResponse,
  type GetFollowersByUserIdResponse,
  type GetFollowingsByUserIdResponse,
  type GetLikedPostsByUserIdResponse,
  type GetPostsByUserIdResponse,
  type GetUserByIdResponse,
  type RemoveFollowerByUserIdResponse,
  type SendFollowRequestResponse,
} from "@neetwork/contracts/schemas/users.js";

const UserParamsSchema = z.strictObject({
  userId: z.cuid2(),
});

export const getAllNonFollowingUsers = async (
  req: Request,
  res: Response<GetAllNonFollowingUsersResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.user;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: id },
        followers: {
          none: { senderId: id },
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    const response = GetAllNonFollowingUsersSuccessSchema.parse({
      success: true,
      users,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response<GetUserByIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.user;
  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId } = params.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        about: true,
        _count: {
          select: {
            followers: {
              where: {
                status: "ACCEPTED",
              },
            },
            followings: {
              where: {
                status: "ACCEPTED",
              },
            },
          },
        },
        followers: {
          where: {
            senderId: id,
          },
          select: {
            id: true,
            senderId: true,
            receiverId: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User with ID "${userId}" not found` });
    }

    const response = GetUserByIdSuccessSchema.parse({ success: true, user });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getPostsByUserId = async (
  req: Request,
  res: Response<GetPostsByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id } = req.user;
  const { userId } = params.data;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
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

    const response = GetPostsByUserIdSuccessSchema.parse({
      success: true,
      posts,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getCommentsByUserId = async (
  req: Request,
  res: Response<GetCommentsByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id } = req.user;
  const { userId } = params.data;

  try {
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: {
        created_at: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        post: {
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
        },
      },
    });

    const response = GetCommentsByUserIdSuccessSchema.parse({
      success: true,
      comments,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getLikedPostsByUserId = async (
  req: Request,
  res: Response<GetLikedPostsByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id } = req.user;
  const { userId } = params.data;

  try {
    const likes = await prisma.like.findMany({
      where: { userId },
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        post: {
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
        },
      },
    });

    const response = GetLikedPostsByUserIdSuccessSchema.parse({
      success: true,
      likes,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getFollowersByUserId = async (
  req: Request,
  res: Response<GetFollowersByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId } = params.data;

  try {
    const followers = await prisma.follow.findMany({
      where: {
        receiverId: userId,
        status: "ACCEPTED",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const response = GetFollowersByUserIdSuccessSchema.parse({
      success: true,
      followers,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getFollowingsByUserId = async (
  req: Request,
  res: Response<GetFollowingsByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId } = params.data;

  try {
    const followings = await prisma.follow.findMany({
      where: {
        senderId: userId,
        status: "ACCEPTED",
      },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    const response = GetFollowingsByUserIdSuccessSchema.parse({
      success: true,
      followings,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const sendFollowRequest = async (
  req: Request,
  res: Response<SendFollowRequestResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = req.user.id;
  const receiverId = params.data.userId;

  try {
    await prisma.follow.create({
      data: { senderId, receiverId },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You can't send multiple follow request to a user.",
      });
    }
    next(error);
  }
};

export const deleteFollowRequest = async (
  req: Request,
  res: Response<DeleteFollowRequestResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = req.user.id;
  const receiverId = params.data.userId;

  try {
    await prisma.follow.delete({
      where: { senderId_receiverId: { senderId, receiverId } },
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

export const removeFollowerByUserId = async (
  req: Request,
  res: Response<RemoveFollowerByUserIdResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = req.user.id;
  const receiverId = params.data.userId;

  try {
    await prisma.follow.delete({
      where: {
        senderId_receiverId: { senderId, receiverId },
        status: "ACCEPTED",
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
