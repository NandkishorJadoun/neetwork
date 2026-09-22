import type { GetUserProfileResponse, UpdateProfileResponse } from "@neetwork/contracts";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import {
  GetUserProfileSuccessSchema,
  toFieldErrors,
  UpdateProfileInputSchema,
  UpdateProfileSuccessSchema,
} from "@neetwork/contracts";
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

export const updateUserAccount: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const parsedBody = UpdateProfileInputSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(422).json({
        errors: toFieldErrors(parsedBody.error.issues),
      });
    }

    const { about, fullname } = parsedBody.data;

    const user = await updateUserInfo(req.user.id, fullname, about);

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
