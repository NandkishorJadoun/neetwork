import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import { FollowRequestWithSenderPreviewSchema } from "../shared/entities.js";

export const SendFollowRequestSchema = apiResponse(SuccessSchema);

export type SendFollowRequestResponse = z.infer<typeof SendFollowRequestSchema>;

export const UnfollowUserByIdSchema = apiResponse(SuccessSchema);

export type UnfollowUserByIdResponse = z.infer<
  typeof UnfollowUserByIdSchema
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

export const AcceptFollowRequestSchema = apiResponse(SuccessSchema);

export type AcceptFollowRequestResponse = z.infer<
  typeof AcceptFollowRequestSchema
>;

export const RejectFollowRequestSchema = apiResponse(SuccessSchema);

export type RejectFollowRequestResponse = z.infer<
  typeof RejectFollowRequestSchema
>;

export const RemoveFollowerSchema = apiResponse(SuccessSchema);

export type RemoveFollowerResponse = z.infer<
  typeof RemoveFollowerSchema
>;
