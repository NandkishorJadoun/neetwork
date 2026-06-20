import { prisma } from "../configs/prisma.js";
import type { Response, NextFunction } from "express";
import { CommentFormSchema, PostFormSchema } from "../schemas/form-validation.schema.js";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/index.js";
import type { AuthRequest } from "../types/express.js";

export const getAllPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.user;
  const { cursor, users } = req.query;
  const isFollowingTab = users === "following";
  const isValidCursor = typeof cursor === "string" && cursor.length > 0 && cursor !== 'null'

  const LIMIT = 10;

  try {
    const posts = await prisma.post.findMany({
      ...(isFollowingTab ? {
        where: {
          OR: [
            {
              userId: id
            },
            {
              author: {
                followers: {
                  some: {
                    fromId: id,
                    status: "ACCEPTED"
                  }
                }
              }
            }
          ]
        }
      } : {}),
      ...(isValidCursor ? {
        cursor: {
          id: cursor
        },
        skip: 1
      } : {}),
      take: LIMIT,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        author: {
          select: {
            avatar: true,
            username: true,
            fullname: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        likes: {
          where: {
            userId: id
          }
        }
      }
    })

    const hasNextPage = posts.length === LIMIT;
    const nextCursor = hasNextPage ? posts.at(-1)?.id : null;

    res.status(200).json({ posts, nextCursor })

  } catch (error) {
    next(error)
  }
}

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { body, user } = req;

  try {
    const postForm = PostFormSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        text: postForm.content,
        userId: user.id
      }
    })

    return res.status(201).json({ post })

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ errors: error.issues.map(issue => Object({ fieldName: issue.path[0], message: issue.message })) })
    }
    next(error)
  }
}

export const getPostById = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const { id: userId } = req.user;
  const { postId } = req.params

  if (Array.isArray(postId) || !postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      include: {
        comments: {
          orderBy: {
            created_at: "desc"
          },
          include: {
            author: true
          }
        },
        author: {
          select: {
            avatar: true,
            username: true,
            fullname: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        },
        likes: {
          where: {
            userId
          }
        }
      }
    })

    if (!post) {
      return res.status(404).json({ message: `Post with ID "${postId}" not found` })
    }

    return res.status(200).json({ post })

  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.user.id;
  const id = req.params.postId

  if (Array.isArray(id) || !id) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  try {
    await prisma.post.delete({
      where: { id, userId }
    })

    return res.status(204).send()

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "No record found" })
      }
    }
    next(error)
  }
}

export const createComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { body, user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }
 
  try {
    const commentForm = CommentFormSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        text: commentForm.content,
        userId: user.id,
        postId: params.postId,
      }
    })

    return res.status(201).json({ comment })

  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ errors: error.issues.map(issue => Object({ fieldName: issue.path[0], message: issue.message })) })
    }
    next(error)
  }
}

export const getLikesByPostId = async (req: AuthRequest, res: Response, next: NextFunction) => {

  const { postId } = req.params

  if (Array.isArray(postId) || !postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            avatar: true,
            fullname: true,
            username: true
          },
        },
      },
    })

    return res.json({ likes })

  } catch (error) {
    next(error)
  }
}

export const likePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  try {
    await prisma.like.create({
      data: {
        userId: user.id,
        postId: params.postId,
      }
    })

    return res.status(201).send()

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "You can't like a post multiple times." })
      }
    }
    next(error)
  }
}

export const unlikePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { user, params } = req;
  const { postId } = params;

  if (typeof postId === "object" || !postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  const userId = user.id;

  try {
    await prisma.like.delete({
      where: { userId_postId: { userId, postId } }
    })

    return res.status(204).send()

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "No record found." })
      }
    }
    next(error)
  }
}