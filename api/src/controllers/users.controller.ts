import type { Request, Response, NextFunction } from "express";
import { prisma } from "../configs/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";

export const getAllNonFollowingUsers = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.user;

  try {
    const users = await prisma.user.findMany({
      where: {
        id: { not: id },
        followers: {
          none: { fromId: id }
        }
      },
    })

    return res.status(200).json({ users })

  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.user;

  if (Array.isArray(userId) || !userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        _count: {
          select: {
            followers: {
              where: {
                status: "ACCEPTED"
              }
            },
            followings: {
              where: {
                status: "ACCEPTED"
              }
            },
          }
        },
        followers: {
          where: {
            fromId: id,
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: `User with ID "${userId}" not found` })
    }

    return res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

export const getPostsByUserId = async (req: Request, res: Response, next: NextFunction) => {

  const { params, user } = req

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Array.isArray(params.userId) || !params.userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  const { id } = user;
  const { userId } = params;

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
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

    return res.status(200).json({ posts })
  } catch (error) {
    next(error)
  }
}

export const getCommentsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { params, user } = req

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Array.isArray(params.userId) || !params.userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  const { id } = user;
  const { userId } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { userId },
      orderBy: {
        created_at: "desc"
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
            username: true,
            avatar: true
          }
        },
        post: {
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
        }
      }
    })

    return res.status(200).json({ comments })
  } catch (error) {
    next(error)
  }
}

export const getLikedPostsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { params, user } = req

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (Array.isArray(params.userId) || !params.userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  const { id } = user;
  const { userId } = params;

  try {
    const likes = await prisma.like.findMany({
      where: { userId },
      orderBy: {
        id: "desc"
      },
      select: {
        id: true,
        post: {
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
        }
      }
    })

    return res.status(200).json({ likes })
  } catch (error) {
    next(error)
  }
}

export const getFollowersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  if (Array.isArray(userId) || !userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    const followers = await prisma.follow.findMany({
      where: {
        toId: userId,
        status: "ACCEPTED"
      },
      include: {
        sender: true
      }
    })

    return res.status(200).json({ followers })
  } catch (error) {
    next(error)
  }
}

export const getFollowingsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params

  if (Array.isArray(userId) || !userId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    const followings = await prisma.follow.findMany({
      where: {
        fromId: userId,
        status: "ACCEPTED"
      },
      include: {
        receiver: true
      }
    })

    return res.status(200).json({ followings })
  } catch (error) {
    next(error)
  }
}

export const sendFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const fromId = req.user.id;
  const toId = req.params.userId

  if (Array.isArray(toId) || !toId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    const followRequest = await prisma.follow.create({
      data: { fromId, toId }
    })

    return res.status(200).json({ followRequest })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "You can't send multiple follow request to a user." })
      }
    }
    next(error)
  }
}

export const deleteFollowRequest = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const fromId = req.user.id;
  const toId = req.params.userId

  if (Array.isArray(toId) || !toId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    await prisma.follow.delete({
      where: { fromId_toId: { fromId, toId } }
    })

    return res.status(204).send()

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "No record found for delete operation" })
      }
    }
    next(error)
  }
}

export const removeFollowerByUserId = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const fromId = req.user.id;
  const toId = req.params.userId;

  if (Array.isArray(toId) || !toId) {
    return res.status(400).json({ message: "Invalid User ID" })
  }

  try {
    await prisma.follow.delete({
      where: {
        fromId_toId: { fromId, toId },
        status: "ACCEPTED"
      }
    })

    return res.status(204).send()

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "No record found for delete operation" })
      }
    }
    next(error)
  }
}