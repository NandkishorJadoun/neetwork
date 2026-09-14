import type { AcceptFollowRequestResponse, GetAllFollowRequestsResponse, RejectFollowRequestResponse, RemoveFollowerResponse, SendFollowRequestResponse, unfollowUserByIdResponse } from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import {
  GetAllFollowRequestsSuccessSchema,

} from "@neetwork/contracts";
import { z } from "zod/v4";
import { PrismaClientKnownRequestError } from "../../../generated/prisma/runtime/client.js";
import { createFollowRequest, deleteFollowRequest, findAllFollowRequests, removeFollowerById, unfollowUser, updateFollowRequest } from "./follows.service.js";

const UserParamsSchema = z.strictObject({
  userId: z.uuidv7(),
});

export async function sendFollowRequest(req: Request, res: Response<SendFollowRequestResponse>, next: NextFunction) {
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
    await createFollowRequest(senderId, receiverId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError
      && error.code === "P2002"
    ) {
      return res.status(409).json({
        success: false,
        message: "You can't send multiple follow request to a user.",
      });
    }
    next(error);
  }
}

export async function unfollowUserById(req: Request, res: Response<unfollowUserByIdResponse>, next: NextFunction) {
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
    await unfollowUser(senderId, receiverId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError
      && error.code === "P2025"
    ) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }
    next(error);
  }
}

export async function getAllFollowRequests(req: Request, res: Response<GetAllFollowRequestsResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const followRequests = await findAllFollowRequests(req.user.id);

    const response = GetAllFollowRequestsSuccessSchema.parse({
      success: true,
      followRequests,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function acceptFollowRequest(req: Request, res: Response<AcceptFollowRequestResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = params.data.userId;
  const receiverId = req.user.id;

  try {
    await updateFollowRequest(senderId, receiverId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (error instanceof PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
}

export async function rejectFollowRequest(req: Request, res: Response<RejectFollowRequestResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = params.data.userId;
  const receiverId = req.user.id;

  try {
    await deleteFollowRequest(senderId, receiverId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (error instanceof PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
}

export async function removeFollower(req: Request, res: Response<RemoveFollowerResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const params = UserParamsSchema.safeParse(req.params);

  if (!params.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const senderId = params.data.userId;
  const receiverId = req.user.id;

  try {
    await removeFollowerById(senderId, receiverId);

    return res.status(200).json({ success: true });
  }
  catch (error) {
    if (error instanceof PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
}
