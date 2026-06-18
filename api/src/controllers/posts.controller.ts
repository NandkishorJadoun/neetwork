import { prisma } from "../libs/prisma.js";
import type { Request, Response, NextFunction } from "express";
import { CommentFormSchema, PostFormSchema } from "../schemas/form-validation.schema.js";
import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/index.js";

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.user;
  const { cursor } = req.query;
  const isValidCursor = typeof cursor === "string" && cursor.length > 0
  const LIMIT = 10

  try {
    const posts = await prisma.post.findMany({
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

export const getFollowingUserPosts = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.user;

  try {
    const posts = await prisma.post.findMany({
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

      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return res.status(200).json({ posts })

  } catch (error) {
    next(error)
  }
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { body, user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
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

export const getLikesByPostId = async (req: Request, res: Response, next: NextFunction) => {

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

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  const { user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
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

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  const { user, params } = req;

  if (Array.isArray(params.postId) || !params.postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { postId } = params;
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