import { z } from "zod/v4";
import { ApiErrorSchema } from "../shared/api-error.js";

export const GetUserProfileSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: z.strictObject({
    id: z.cuid2(),
    name: z.string(),
    image: z.string().nullable(),
    about: z.string().nullable(),
  }),
});

export const GetUserProfileResponseSchema = z.discriminatedUnion("success", [
  GetUserProfileSuccessSchema,
  ApiErrorSchema,
]);

export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;

export const GetAllFollowRequestsSuccessSchema = z.strictObject({
  success: z.literal(true),
  followRequests: z.array(z.strictObject({
    id: z.cuid2(),
    fromId: z.cuid2(),
    toId: z.cuid2(),
    status: z.enum(["PENDING", "ACCEPTED"]),
    sender: z.strictObject({
      image: z.string().nullable(),
      name: z.string(),
    }),
  })),
});

export const GetAllFollowRequestsSchema = z.discriminatedUnion("success", [
  GetAllFollowRequestsSuccessSchema,
  ApiErrorSchema,
]);

export type GetAllFollowRequestsResponse = z.infer<
  typeof GetAllFollowRequestsSchema
>;

export const AcceptFollowRequestSchema = z.discriminatedUnion("success", [z.strictObject({ success: z.literal(true) }), ApiErrorSchema])

export type AcceptFollowRequestResponse = z.infer<
  typeof AcceptFollowRequestSchema
>;

export const RejectFollowRequestSchema = z.discriminatedUnion("success", [z.strictObject({ success: z.literal(true) }), ApiErrorSchema])

export type RejectFollowRequestResponse = z.infer<
  typeof RejectFollowRequestSchema
>;

export const RemoveFollowerSchema = z.discriminatedUnion("success", [z.strictObject({ success: z.literal(true) }), ApiErrorSchema])

export type RemoveFollowerResponse = z.infer<
  typeof RemoveFollowerSchema
>;