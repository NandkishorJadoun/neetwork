import type { GetAllNonFollowingUsersResponse, GetCommentsByUserIdResponse, GetFollowersByUserIdResponse, GetFollowingsByUserIdResponse, GetLikedPostsByUserIdResponse, GetPostsByUserIdResponse, GetUserByIdResponse } from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import {
  GetAllNonFollowingUsersSuccessSchema,
  GetCommentsByUserIdSuccessSchema,
  GetFollowersByUserIdSuccessSchema,
  GetFollowingsByUserIdSuccessSchema,
  GetLikedPostsByUserIdSuccessSchema,
  GetPostsByUserIdSuccessSchema,
  GetUserByIdSuccessSchema,

} from "@neetwork/contracts";

import { z } from "zod/v4";

import { findCommentsByUserId } from "../comments/comments.service.js";
import { findUserFollowers, findUserFollowings } from "../follows/follows.service.js";
import { findLikedPostsByUserId } from "../likes/likes.service.js";
import { findPostsById } from "../posts/posts.service.js";
import { findNonFollowingUsers, findUserProfile } from "./users.service.js";

const UserParamsSchema = z.strictObject({
  userId: z.uuidv7(),
});

export async function getAllNonFollowingUsers(req: Request, res: Response<GetAllNonFollowingUsersResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.user;

  try {
    const users = await findNonFollowingUsers(id);

    const response = GetAllNonFollowingUsersSuccessSchema.parse({
      success: true,
      users,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getUserById(req: Request, res: Response<GetUserByIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id: userId } = req.user;
  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId: viewerId } = params.data;

  try {
    const user = await findUserProfile(userId, viewerId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: `User not found` });
    }

    const response = GetUserByIdSuccessSchema.parse({ success: true, user });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getPostsByUserId(req: Request, res: Response<GetPostsByUserIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id: userId } = req.user;
  const { userId: viewerId } = params.data;

  try {
    const posts = await findPostsById(userId, viewerId);

    const response = GetPostsByUserIdSuccessSchema.parse({
      success: true,
      posts,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getCommentsByUserId(req: Request, res: Response<GetCommentsByUserIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id: userId } = req.user;
  const { userId: viewerId } = params.data;

  try {
    const comments = await findCommentsByUserId(userId, viewerId);

    const response = GetCommentsByUserIdSuccessSchema.parse({
      success: true,
      comments,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getLikedPostsByUserId(req: Request, res: Response<GetLikedPostsByUserIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { id: userId } = req.user;
  const { userId: viewerId } = params.data;

  try {
    const likes = await findLikedPostsByUserId(userId, viewerId);

    const response = GetLikedPostsByUserIdSuccessSchema.parse({
      success: true,
      likes,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getFollowersByUserId(req: Request, res: Response<GetFollowersByUserIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId } = params.data;

  try {
    const followers = await findUserFollowers(userId);

    const response = GetFollowersByUserIdSuccessSchema.parse({
      success: true,
      followers,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function getFollowingsByUserId(req: Request, res: Response<GetFollowingsByUserIdResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  const { userId } = params.data;

  try {
    const followings = await findUserFollowings(userId);

    const response = GetFollowingsByUserIdSuccessSchema.parse({
      success: true,
      followings,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}
