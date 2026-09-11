import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import {
  FollowRequestWithSenderPreviewSchema,
  UserPreviewSchema,
} from "../shared/entities.js";

export const GetUserProfileSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: UserPreviewSchema.extend({
    about: z.string().nullable(),
  }),
});

export const GetUserProfileResponseSchema = apiResponse(
  GetUserProfileSuccessSchema,
);

export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;

export const GetAllFollowRequestsSuccessSchema = z.strictObject({
  success: z.literal(true),
  followRequests: z.array(FollowRequestWithSenderPreviewSchema),
});

export const GetAllFollowRequestsSchema = apiResponse(
  GetAllFollowRequestsSuccessSchema,
);

export type GetAllFollowRequestsResponse = z.infer<
  typeof GetAllFollowRequestsSchema
>;

export const AcceptFollowRequestSchema = apiResponse(SuccessSchema)

export type AcceptFollowRequestResponse = z.infer<
  typeof AcceptFollowRequestSchema
>;

export const RejectFollowRequestSchema = apiResponse(SuccessSchema)

export type RejectFollowRequestResponse = z.infer<
  typeof RejectFollowRequestSchema
>;

export const RemoveFollowerSchema = apiResponse(SuccessSchema)

export type RemoveFollowerResponse = z.infer<
  typeof RemoveFollowerSchema
>;
