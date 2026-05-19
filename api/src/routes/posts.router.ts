import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { prisma } from "../libs/prisma.js"
import { ZodError } from "zod";
import { PostFormSchema } from "../schemas/form-validation.schema.js";
import { Prisma } from "@prisma/client";

export const postsRouter: Router = express.Router();

postsRouter.use(passport.authenticate("jwt", { session: false }))

postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        created_at: 'desc',
      },
    })

    return res.status(200).json({ posts })

  } catch (error) {
    next(error)
  }
})

postsRouter.get("/following", async (req, res, next) => {
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
      orderBy: {
        created_at: 'desc',
      },
    })

    return res.status(200).json({ posts })

  } catch (error) {
    next(error)
  }
})

postsRouter.post("/", async (req, res, next) => {
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
})

postsRouter.get("/:postId", async (req, res, next) => {
  const { postId } = req.params

  if (Array.isArray(postId) || !postId) {
    return res.status(400).json({ message: "Invalid Post ID" })
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    })

    if (!post) {
      return res.status(404).json({ message: `Post with ID "${postId}" not found` })
    }

    return res.status(200).json({ post })

  } catch (error) {
    next(error)
  }
})

postsRouter.delete("/:postId", async (req, res, next) => {
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
})