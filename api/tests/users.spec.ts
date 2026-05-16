import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll } from 'vitest'
import request from "supertest"
import { prisma } from "../src/libs/prisma"
import { createMockUser } from "../src/scripts/mock-users"
import { env } from '../src/schemas/env.schema'
import jwt from "jsonwebtoken"

const fakeUsers = Array.from({ length: 10 }).map(() => createMockUser());

beforeAll(async () => await prisma.user.createMany({ data: fakeUsers }))
afterAll(async () => {
    await prisma.follow.deleteMany({})
    await prisma.user.deleteMany({})
})

describe("GET /users", () => {
    it("show all users since user haven't send anyone a follow request yet", async () => {
        const user = fakeUsers[0]
        const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

        const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.users.length).toEqual(9)
    })

    it("show all users who exist on the platform but user haven't send follow request yet", async () => {
        const [userA, userB] = fakeUsers;

        // userA followed userB

        await prisma.follow.create({
            data: { fromId: userA.id, toId: userB.id }
        })

        const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);
        const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.users.length).toEqual(8)
    })
})

describe("GET /users/:userId", () => {
    it("will send 404 if user don't exist", async () => {
        const [user] = fakeUsers
        const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

        // fetching user from id that dont exist
        const userId = "FakeUserId"
        const res = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe(`User with ID "${userId}" not found`)
    })

    it("will send the user info", async () => {
        const [userA, userB] = fakeUsers;

        const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);
        const res = await request(app).get(`/users/${userB.id}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.user).toEqual(userB)
    })
})