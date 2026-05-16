import express, { Router } from "express"
import { passport } from "../libs/passport.js";
import { prisma } from "../libs/prisma.js"

export const usersRouter: Router = express.Router();

usersRouter.use(passport.authenticate("jwt", { session: false }))
usersRouter.get("/", async (req, res, next) => {
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
            include: { followers: true }
        })

        return res.status(200).json({ users })

    } catch (error) {
        next(error)
    }
})
usersRouter.get("/:userId", async (req, res, next) => {
    const { userId } = req.params

    if (Array.isArray(userId) || !userId) {
        return res.status(400).json({ message: "Invalid User ID" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!user) {
            return res.status(404).json({ message: `User with ID "${userId}" not found` })
        }

        return res.status(200).json({user})
    } catch (error) {
        next(error)
    }
})