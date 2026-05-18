import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { upload } from "../libs/multer.js";
import { ZodError } from "zod";
import { PatchFormDataSchema } from "../schemas/user.schema.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { prisma } from "../libs/prisma.js"
import { Prisma } from "@prisma/client";

export const profileRouter: Router = express.Router();

profileRouter.use(passport.authenticate("jwt", { session: false }))

profileRouter.get("/", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.user

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, fullname: true, avatar: true, about: true }
        })

        return res.status(200).json({ user })

    } catch (error) {
        next(error)
    }
})

profileRouter.patch("/", upload.single("avatar"), async (req, res, next) => {
    const { file, body, user } = req

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = user;
    let avatar = null;

    try {
        if (file) {
            avatar = (await uploadOnCloudinary(file)).secure_url
        }

        const userForm = PatchFormDataSchema.parse(body)

        const user = await prisma.user.update({
            where: { id },
            data: { ...(avatar && { avatar }), ...userForm },
            select: { id: true, fullname: true, avatar: true, about: true }
        })

        return res.status(200).json({ user })

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(422).json({ errors: error.issues.map(issue => Object({ fieldName: issue.path[0], message: issue.message })) })
        }
        next(error)
    }
})

profileRouter.get("/follow-requests", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.user

    try {
        const followRequests = await prisma.follow.findMany({
            where: { toId: id, status: "PENDING" },
        })

        return res.status(200).json({ followRequests })

    } catch (error) {
        next(error)
    }
})

profileRouter.patch("/follow-requests/:userId", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const toId = req.user.id
    const fromId = req.params.userId;

    if (Array.isArray(fromId) || !fromId) {
        return res.status(400).json({ message: "Invalid User ID" })
    }

    try {
        const follower = await prisma.follow.update({
            where: {
                fromId_toId: { fromId, toId },
                status: "PENDING"
            },
            data: {
                status: "ACCEPTED"
            }
        })

        return res.status(200).json({ follower })

    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return res.status(404).json({ message: "No record found" })
            }
        }
        next(error)
    }
})

profileRouter.delete("/follow-requests/:userId", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const toId = req.user.id
    const fromId = req.params.userId;

    if (Array.isArray(fromId) || !fromId) {
        return res.status(400).json({ message: "Invalid User ID" })
    }

    try {
        await prisma.follow.delete({
            where: {
                fromId_toId: { fromId, toId },
                status: "PENDING"
            },
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

profileRouter.delete("/followers/:userId", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const toId = req.user.id
    const fromId = req.params.userId;

    if (Array.isArray(fromId) || !fromId) {
        return res.status(400).json({ message: "Invalid User ID" })
    }

    try {
        await prisma.follow.delete({
            where: {
                fromId_toId: { fromId, toId },
                status: "ACCEPTED"
            },
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