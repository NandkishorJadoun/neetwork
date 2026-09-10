import type { Request, Response, NextFunction } from "express";
import { PostFormSchema } from "../../configs/schemas.js";
import { ZodError, z } from "zod/v4";
import { Prisma } from "../../../generated/prisma/index.js";
import {
    GetAllPostsSuccessSchema,
    GetPostByIdSuccessSchema,
    type DeletePostResponse,
    type GetAllPostsResponse,
    type GetPostByIdResponse,
} from "@neetwork/contracts/schemas/posts.js";
import { findAllPost, findPostById, insertPost, removePostById } from "./posts.service.js";

const GetAllPostsQuerySchema = z.strictObject({
    cursor: z.uuidv7().optional(),
    users: z.literal("following").optional(),
});

const PostParamsSchema = z.strictObject({
    postId: z.uuidv7(),
});

export const getAllPosts = async (
    req: Request,
    res: Response<GetAllPostsResponse>,
    next: NextFunction,
) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id: userId } = req.user;
    const { cursor, users: followingUsersTab } = GetAllPostsQuerySchema.parse(req.query);

    const LIMIT = 10;

    try {
        const posts = await findAllPost(userId, LIMIT, Boolean(followingUsersTab), cursor);

        const hasNextPage = posts.length === LIMIT;
        const lastPost = posts.at(-1);

        const nextCursor = hasNextPage && lastPost ? lastPost.id : null;

        const response = GetAllPostsSuccessSchema.parse({
            success: true,
            posts,
            nextCursor,
        });

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { user } = req;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const { content } = PostFormSchema.parse(req.body);

        const post = await insertPost(user.id, content)

        return res.status(201).json({ post });
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

export const getPostById = async (
    req: Request,
    res: Response<GetPostByIdResponse>,
    next: NextFunction,
) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id: userId } = req.user;
    const params = PostParamsSchema.safeParse(req.params);

    if (!params.success) {
        return res.status(404).json({ success: false, message: "Invalid Post ID" });
    }

    const { postId } = params.data;

    try {
        const post = await findPostById(userId, postId)

        if (!post) {
            return res
                .status(404)
                .json({ success: false, message: "Post not found" });
        }

        const response = GetPostByIdSuccessSchema.parse({ success: true, post });

        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (
    req: Request,
    res: Response<DeletePostResponse>,
    next: NextFunction,
) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const params = PostParamsSchema.safeParse(req.params);

    if (!params.success) {
        return res.status(404).json({ success: false, message: "Invalid Post ID" });
    }

    try {
        await removePostById(req.user.id, params.data.postId)

        return res.status(200).json({ success: true });
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
        ) {
            return res
                .status(404)
                .json({ success: false, message: "No record found" });
        }
        next(error);
    }
};