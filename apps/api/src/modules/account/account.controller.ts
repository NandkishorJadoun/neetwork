import type { Response, Request, NextFunction, RequestHandler } from "express";
import { findUserProfile, updateUserInfo } from "./account.service.js";
import { uploadOnCloudinary } from "../../configs/cloudinary.js";
import { PatchFormDataSchema } from "../../configs/schemas.js";
import { ZodError } from "zod";
import { GetUserProfileSuccessSchema, type GetUserProfileResponse } from "@neetwork/contracts";

export const getUserAccount = async (
  req: Request,
  res: Response<GetUserProfileResponse>,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const user = await findUserProfile(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const response = GetUserProfileSuccessSchema.parse({
      success: true,
      user,
    });

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const updateUserAccount: RequestHandler = async (req, res, next) => {
  const { file } = req;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let image = null;

  try {
    if (file) {
      image = (await uploadOnCloudinary(file)).secure_url;
    }

    const { fullname, about } = PatchFormDataSchema.parse(req.body);

    const user = await updateUserInfo(req.user.id, image, fullname, about);

    return res.status(200).json({ user });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        errors: error.issues.map((issue) =>
        ({ fieldName: issue.path[0], message: issue.message }),
        ),
      });
    }
    next(error);
  }
};