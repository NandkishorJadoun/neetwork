import { z } from "zod/v4";

export const AuthorPreviewSchema = z.strictObject({
  image: z.string().nullable(),
  name: z.string(),
});

export const UserPreviewSchema = z.strictObject({
  id: z.uuidv7(),
  name: z.string(),
  image: z.string().nullable(),
});

export const LikeRefSchema = z.strictObject({
  id: z.uuidv7(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
});

export const PostCountsSchema = z.strictObject({
  comments: z.number(),
  likes: z.number(),
});

export const PostCardSchema = z.strictObject({
  _count: PostCountsSchema,
  author: AuthorPreviewSchema,
  likes: z.array(LikeRefSchema),
  id: z.uuidv7(),
  text: z.string(),
  created_at: z.date(),
  userId: z.uuidv7(),
});

export const FollowStatusSchema = z.enum(["PENDING", "ACCEPTED"]);

export const FollowRecordSchema = z.strictObject({
  id: z.uuidv7(),
  senderId: z.uuidv7(),
  receiverId: z.uuidv7(),
  status: FollowStatusSchema,
});

export const FollowRecordWithSenderSchema = FollowRecordSchema.extend({
  sender: UserPreviewSchema,
});

export const FollowRecordWithReceiverSchema = FollowRecordSchema.extend({
  receiver: UserPreviewSchema,
});

export const FollowRequestWithSenderPreviewSchema = FollowRecordSchema.extend({
  sender: AuthorPreviewSchema,
});

export const CommentAuthorSchema = z.strictObject({
  id: z.uuidv7(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CommentWithAuthorSchema = z.strictObject({
  id: z.uuidv7(),
  text: z.string(),
  created_at: z.date(),
  userId: z.uuidv7(),
  postId: z.uuidv7(),
  author: CommentAuthorSchema,
});

export const CommentWithAuthorAndPostSchema = CommentWithAuthorSchema.extend({
  post: PostCardSchema,
});

export const LikeWithUserSchema = z.strictObject({
  id: z.uuidv7(),
  user: UserPreviewSchema,
});

export const LikedPostSchema = z.strictObject({
  id: z.uuidv7(),
  post: PostCardSchema,
});

export const UserFollowCountsSchema = z.strictObject({
  followers: z.number(),
  followings: z.number(),
});
