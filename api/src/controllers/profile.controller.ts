import { ZodError } from "zod";
import { prisma } from "../configs/prisma.js";
import { Prisma } from "../../generated/prisma/index.js";
import type { Response, NextFunction } from "express";
import { uploadOnCloudinary } from "../configs/cloudinary.js";
import { PatchFormDataSchema } from "../schemas/form-validation.schema.js";
import type { AuthRequest } from "../types/express.js";

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
}

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { file, body, user } = req

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

}

export const getAllFollowRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.user

    try {
        const followRequests = await prisma.follow.findMany({
            where: { toId: id, status: "PENDING" },
            include: {
                sender: {
                    select: {
                        avatar: true,
                        username: true,
                        fullname: true,
                    }
                }
            }
        })

        return res.status(200).json({ followRequests })

    } catch (error) {
        next(error)
    }
}

export const acceptFollowRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
}

export const rejectFollowRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {

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
}

export const removeFollower = async (req: AuthRequest, res: Response, next: NextFunction) => {

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
}