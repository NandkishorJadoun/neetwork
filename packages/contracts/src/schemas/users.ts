import { z } from "zod/v4";
import { apiResponse, SuccessSchema } from "../shared/api-response.js";
import {
  CommentWithAuthorAndPostSchema,
  FollowRecordSchema,
  FollowRecordWithReceiverSchema,
  FollowRecordWithSenderSchema,
  LikedPostSchema,
  PostCardSchema,
  UserFollowCountsSchema,
  UserPreviewSchema,
} from "../shared/entities.js";

export const GetAllNonFollowingUsersSuccessSchema = z.strictObject({
  success: z.literal(true),
  users: z.array(UserPreviewSchema),
});

export const GetAllNonFollowingUsersSchema = apiResponse(
  GetAllNonFollowingUsersSuccessSchema,
);

export type GetAllNonFollowingUsersResponse = z.infer<
  typeof GetAllNonFollowingUsersSchema
>;

export const GetUserByIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: z.strictObject({
    id: z.uuidv7(),
    name: z.string(),
    image: z.string().nullable(),
    about: z.string().nullable(),
    _count: UserFollowCountsSchema,
    followers: z.array(FollowRecordSchema),
  }),
});

export const GetUserByIdSchema = apiResponse(GetUserByIdSuccessSchema);

export type GetUserByIdResponse = z.infer<typeof GetUserByIdSchema>;

export const GetPostsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  posts: z.array(PostCardSchema),
});

export const GetPostsByUserIdSchema = apiResponse(GetPostsByUserIdSuccessSchema);

export type GetPostsByUserIdResponse = z.infer<typeof GetPostsByUserIdSchema>;

export const GetCommentsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  comments: z.array(CommentWithAuthorAndPostSchema),
});

export const GetCommentsByUserIdSchema = apiResponse(
  GetCommentsByUserIdSuccessSchema,
);

export type GetCommentsByUserIdResponse = z.infer<
  typeof GetCommentsByUserIdSchema
>;

export const GetLikedPostsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  likes: z.array(LikedPostSchema),
});

export const GetLikedPostsByUserIdSchema = apiResponse(
  GetLikedPostsByUserIdSuccessSchema,
);

export type GetLikedPostsByUserIdResponse = z.infer<
  typeof GetLikedPostsByUserIdSchema
>;

export const GetFollowersByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  followers: z.array(FollowRecordWithSenderSchema),
});

export const GetFollowersByUserIdSchema = apiResponse(
  GetFollowersByUserIdSuccessSchema,
);

export type GetFollowersByUserIdResponse = z.infer<
  typeof GetFollowersByUserIdSchema
>;

export const GetFollowingsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  followings: z.array(FollowRecordWithReceiverSchema),
});

export const GetFollowingsByUserIdSchema = apiResponse(
  GetFollowingsByUserIdSuccessSchema,
);

export type GetFollowingsByUserIdResponse = z.infer<
  typeof GetFollowingsByUserIdSchema
>;

export const SendFollowRequestSchema = apiResponse(SuccessSchema);

export type SendFollowRequestResponse = z.infer<typeof SendFollowRequestSchema>;

export const unfollowUserByIdSchema = apiResponse(SuccessSchema);

export type unfollowUserByIdResponse = z.infer<
  typeof unfollowUserByIdSchema
>;
