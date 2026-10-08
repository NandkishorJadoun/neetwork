import type { AvatarSignatureResponse, GetUserProfileResponse, UpdateProfileResponse } from "@neetwork/contracts";
import type { NextFunction, Request, Response } from "express";
import {
  AvatarSignatureSuccessSchema,
  GetUserProfileSuccessSchema,
  toValidationMessage,
  UpdateProfileInputSchema,
  UpdateProfileSuccessSchema,
} from "@neetwork/contracts";
import { createAvatarSignature } from "../../configs/cloudinary.js";
import { env } from "../../configs/env.js";
import { findUserProfile, updateUserInfo } from "./account.service.js";

export async function getUserAccount(req: Request, res: Response<GetUserProfileResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const user = await findUserProfile(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const response = GetUserProfileSuccessSchema.parse({
      success: true,
      user,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}

export async function updateUserAccount(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const parsedBody = UpdateProfileInputSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(422).json({
        success: false,
        message: toValidationMessage(parsedBody.error.issues),
      });
    }

    const { about, fullname, image } = parsedBody.data;

    if (typeof image === "string") {
      const allowed = new RegExp(
        `^https://res\\.cloudinary\\.com/${env.CLOUDINARY_CLOUD_NAME}/image/upload/.+skypaglu/avatars/.+$`,
      );
      if (!allowed.test(image)) {
        return res.status(422).json({
          success: false,
          message: "Invalid avatar URL",
        });
      }
    }

    const user = await updateUserInfo(req.user.id, fullname, about, image);

    const response: UpdateProfileResponse = UpdateProfileSuccessSchema.parse({
      success: true,
      user,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
};

export async function getAvatarSignature(req: Request, res: Response<AvatarSignatureResponse>, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = createAvatarSignature(req.user.id);

    const response = AvatarSignatureSuccessSchema.parse({
      success: true,
      ...payload,
    });

    return res.status(200).json(response);
  }
  catch (error) {
    next(error);
  }
}
