import { ZodError, z } from "zod";
import { prisma } from "../configs/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import type { RequestHandler, Request, Response, NextFunction } from "express";
import { uploadOnCloudinary } from "../configs/cloudinary.js";
import { PatchFormDataSchema } from "../configs/schemas.js";
import {
  GetAllFollowRequestsSuccessSchema,
  GetUserProfileSuccessSchema, type AcceptFollowRequestResponse, type GetAllFollowRequestsResponse, type GetUserProfileResponse,
  type RejectFollowRequestResponse,
  type RemoveFollowerResponse,
} from "@neetwork/contracts/schemas/profile.js";

const FollowRequestBodySchema = z.strictObject({
  userId: z.cuid2(),
})

export const getUserProfile = async (
  req: Request,
  res: Response<GetUserProfileResponse>,
  next: NextFunction,
) => {
  const { user: sessionUser } = req;

  if (!sessionUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userData = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { image: true, about: true },
    });

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = {
      ...userData,
      id: sessionUser.id,
      name: sessionUser.name,
    };

    const response = GetUserProfileSuccessSchema.parse({
      success: true,
      user,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile: RequestHandler = async (req, res, next) => {
  const { file, user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = user;
  let image = null;

  try {
    if (file) {
      image = (await uploadOnCloudinary(file)).secure_url;
    }

    const userForm = PatchFormDataSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id },
      data: { ...(image && { image }), ...userForm },
      select: { id: true, name: true, image: true, about: true },
    });

    return res.status(200).json({ user });
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

export const getAllFollowRequests = async (
  req: Request,
  res: Response<GetAllFollowRequestsResponse>,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const { id } = req.user;

  try {
    const followRequests = await prisma.follow.findMany({
      where: { toId: id, status: "PENDING" },
      include: {
        sender: {
          select: {
            image: true,
            name: true,
          },
        },
      },
    });

    const response = GetAllFollowRequestsSuccessSchema.parse({
      success: true,
      followRequests,
    })

    return res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};

export const acceptFollowRequest = async (req: Request, res: Response<AcceptFollowRequestResponse>, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const body = FollowRequestBodySchema.safeParse(req.body)

  if (!body.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const toId = req.user.id;
  const fromId = body.data.userId;

  try {
    await prisma.follow.update({
      where: {
        fromId_toId: { fromId, toId },
        status: "PENDING",
      },
      data: {
        status: "ACCEPTED",
      },
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
};

export const rejectFollowRequest = async (req: Request, res: Response<RejectFollowRequestResponse>, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const body = FollowRequestBodySchema.safeParse(req.body)

  if (!body.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const toId = req.user.id;
  const fromId = body.data.userId;

  try {
    await prisma.follow.delete({
      where: {
        fromId_toId: { fromId, toId },
        status: "PENDING",
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
};

export const removeFollower = async (req: Request, res: Response<RemoveFollowerResponse>, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const body = FollowRequestBodySchema.safeParse(req.body)

  if (!body.success) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const toId = req.user.id;
  const fromId = body.data.userId;

  try {
    await prisma.follow.delete({
      where: {
        fromId_toId: { fromId, toId },
        status: "ACCEPTED",
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === "P2025") {
      return res.status(404).json({ success: false, message: "No record found" });
    }
    next(error);
  }
};