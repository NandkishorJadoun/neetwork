import { z } from "zod/v4";
import { ApiErrorSchema } from "../shared/api-error.js";

export const GetAllNonFollowingUsersSuccessSchema = z.strictObject({
  success: z.literal(true),
  users: z.array(
    z.strictObject({
      id: z.cuid2(),
      name: z.string(),
      image: z.string().nullable(),
    }),
  ),
});

export const GetAllNonFollowingUsersSchema = z.discriminatedUnion("success", [
  GetAllNonFollowingUsersSuccessSchema,
  ApiErrorSchema,
]);

export type GetAllNonFollowingUsersResponse = z.infer<
  typeof GetAllNonFollowingUsersSchema
>;

export const GetUserByIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  user: z.strictObject({
    id: z.cuid2(),
    name: z.string(),
    image: z.string().nullable(),
    about: z.string().nullable(),
    _count: z.strictObject({
      followers: z.number(),
      followings: z.number(),
    }),
    followers: z.array(
      z.strictObject({
        id: z.cuid2(),
        senderId: z.cuid2(),
        receiverId: z.cuid2(),
        status: z.enum(["PENDING", "ACCEPTED"]),
      }),
    ),
  }),
});

export const GetUserByIdSchema = z.discriminatedUnion("success", [
  GetUserByIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetUserByIdResponse = z.infer<typeof GetUserByIdSchema>;

export const GetPostsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  posts: z.array(
    z.strictObject({
      _count: z.strictObject({
        comments: z.number(),
        likes: z.number(),
      }),
      author: z.strictObject({
        image: z.string().nullable(),
        name: z.string(),
      }),
      likes: z.array(
        z.strictObject({
          id: z.cuid2(),
          userId: z.cuid2(),
          postId: z.cuid2(),
        }),
      ),
      id: z.cuid2(),
      text: z.string(),
      created_at: z.date(),
      userId: z.cuid2(),
    }),
  ),
});

export const GetPostsByUserIdSchema = z.discriminatedUnion("success", [
  GetPostsByUserIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetPostsByUserIdResponse = z.infer<typeof GetPostsByUserIdSchema>;

export const GetCommentsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  comments: z.array(
    z.strictObject({
      id: z.cuid2(),
      text: z.string(),
      created_at: z.date(),
      userId: z.cuid2(),
      postId: z.cuid2(),
      author: z.strictObject({
        id: z.cuid2(),
        name: z.string(),
        image: z.string().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      post: z.strictObject({
        id: z.cuid2(),
        text: z.string(),
        created_at: z.date(),
        userId: z.cuid2(),
        author: z.strictObject({
          image: z.string().nullable(),
          name: z.string(),
        }),
        _count: z.strictObject({
          comments: z.number(),
          likes: z.number(),
        }),
        likes: z.array(
          z.strictObject({
            id: z.cuid2(),
            userId: z.cuid2(),
            postId: z.cuid2(),
          }),
        ),
      }),
    }),
  ),
});

export const GetCommentsByUserIdSchema = z.discriminatedUnion("success", [
  GetCommentsByUserIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetCommentsByUserIdResponse = z.infer<
  typeof GetCommentsByUserIdSchema
>;

export const GetLikedPostsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  likes: z.array(
    z.strictObject({
      id: z.cuid2(),
      post: z.strictObject({
        id: z.cuid2(),
        text: z.string(),
        created_at: z.date(),
        userId: z.cuid2(),
        author: z.strictObject({
          image: z.string().nullable(),
          name: z.string(),
        }),
        _count: z.strictObject({
          comments: z.number(),
          likes: z.number(),
        }),
        likes: z.array(
          z.strictObject({
            id: z.cuid2(),
            userId: z.cuid2(),
            postId: z.cuid2(),
          }),
        ),
      }),
    }),
  ),
});

export const GetLikedPostsByUserIdSchema = z.discriminatedUnion("success", [
  GetLikedPostsByUserIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetLikedPostsByUserIdResponse = z.infer<
  typeof GetLikedPostsByUserIdSchema
>;

export const GetFollowersByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  followers: z.array(
    z.strictObject({
      id: z.cuid2(),
      senderId: z.cuid2(),
      receiverId: z.cuid2(),
      status: z.enum(["PENDING", "ACCEPTED"]),
      sender: z.strictObject({
        id: z.cuid2(),
        name: z.string(),
        image: z.string().nullable(),
      }),
    }),
  ),
});

export const GetFollowersByUserIdSchema = z.discriminatedUnion("success", [
  GetFollowersByUserIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetFollowersByUserIdResponse = z.infer<
  typeof GetFollowersByUserIdSchema
>;

export const GetFollowingsByUserIdSuccessSchema = z.strictObject({
  success: z.literal(true),
  followings: z.array(
    z.strictObject({
      id: z.cuid2(),
      senderId: z.cuid2(),
      receiverId: z.cuid2(),
      status: z.enum(["PENDING", "ACCEPTED"]),
      receiver: z.strictObject({
        id: z.cuid2(),
        name: z.string(),
        image: z.string().nullable(),
      }),
    }),
  ),
});

export const GetFollowingsByUserIdSchema = z.discriminatedUnion("success", [
  GetFollowingsByUserIdSuccessSchema,
  ApiErrorSchema,
]);

export type GetFollowingsByUserIdResponse = z.infer<
  typeof GetFollowingsByUserIdSchema
>;

export const SendFollowRequestSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type SendFollowRequestResponse = z.infer<typeof SendFollowRequestSchema>;

export const DeleteFollowRequestSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type DeleteFollowRequestResponse = z.infer<
  typeof DeleteFollowRequestSchema
>;

export const RemoveFollowerByUserIdSchema = z.discriminatedUnion("success", [
  z.strictObject({ success: z.literal(true) }),
  ApiErrorSchema,
]);

export type RemoveFollowerByUserIdResponse = z.infer<
  typeof RemoveFollowerByUserIdSchema
>;
