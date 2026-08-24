import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma"
import { createMockUser } from "../src/scripts/mock-data"
import { env } from '../src/schemas/env.schema'
import jwt from "jsonwebtoken"
import type { ValidationError } from "../src/types/index"
import type { Follow } from '../generated/prisma'

// mock uploadOnCloudinary function

vi.mock("../src/configs/cloudinary", () => {
    return {
        uploadOnCloudinary: vi.fn().mockResolvedValue({
            secure_url: "https://cloudinary.com"
        })
    }
})

const mockUsers = Array.from({ length: 3 }).map(() => createMockUser());

beforeAll(async () => await prisma.user.createMany({ data: mockUsers }))
afterAll(async () => await prisma.user.deleteMany({}))

describe("GET /me", () => {
    it("should respond with 200 and user profile data", async () => {
        const [user] = mockUsers;
        const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);
        const res = await request(app).get("/me").set('Authorization', `Bearer ${token}`)
        expect(res.status).toEqual(200)
        expect(res.body.user.id).toEqual(user.id)
    })
})

describe("PATCH /me", () => {
    const [user] = mockUsers;
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

    it("should respond with 422 Unprocessable Entity and a validation error when the 'fullname' field is empty", async () => {
        const res = await request(app)
            .patch(`/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "")
            .field("about", "Lorem ipsum")

        const fullnameError = res.body.errors.find((e: ValidationError) => e.fieldName === "fullname")

        expect(res.status).toBe(422)
        expect(fullnameError.message).toBe("Name field can't be empty")
    })

    it("should respond with 200 OK and return the updated user profile when valid text data is provided", async () => {
        const res = await request(app)
            .patch(`/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")

        expect(res.status).toBe(200)
        expect(res.body.user.fullname).toBe("John doe")
        expect(res.body.user.about).toBe("Lorem ipsum")
    })

    it("should respond with 415 Unsupported Media Type when the uploaded avatar file is not an image", async () => {
        const mockBuffer = Buffer.from('mock-data');

        const res = await request(app)
            .patch(`/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'video.mp4')

        expect(res.status).toBe(415)
    })

    it("should successfully update and return the new avatar URL when a valid image file is uploaded", async () => {
        const mockBuffer = Buffer.from('mock-data');

        const res = await request(app)
            .patch(`/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'image.png')

        expect(res.status).toBe(200)
        expect(res.body.user.avatar).toBe("https://cloudinary.com")
    })
})

describe("GET /me/follow-requests", () => {
    const [userA, userB, userC] = mockUsers;

    beforeEach(async () => {
        await prisma.follow.createMany({
            data: [
                { fromId: userA.id, toId: userB.id },
                { fromId: userA.id, toId: userC.id },
                { fromId: userB.id, toId: userC.id }
            ]
        })
    })

    afterEach(async () => await prisma.follow.deleteMany({}))

    it("should return a list of all incoming follow requests for a user with multiple pending requests", async () => {
        const token = jwt.sign({ id: userC.id }, env.JWT_SECRET_KEY);
        const res = await request(app).get("/me/follow-requests").set('Authorization', `Bearer ${token}`)

        const followRequests = res.body.followRequests.map((e: Follow) => e.fromId)

        expect(res.status).toBe(200)
        expect(res.body.followRequests.length).toBe(2)
        expect(followRequests).toEqual([userA.id, userB.id])
    })

    it("should return an empty array when the authenticated user has no pending incoming follow requests", async () => {
        const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);
        const res = await request(app)
            .get("/me/follow-requests")
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.followRequests.length).toBe(0)
    })
})

describe("PATCH /me/follow-requests/:userId", () => {
    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    // UserB sends a follow request to userA
    beforeEach(async () => await prisma.follow.create({ data: { fromId: userB.id, toId: userA.id } }))
    afterEach(async () => await prisma.follow.deleteMany({}))

    it("should successfully accept a pending follow request and update its status to ACCEPTED", async () => {
        const res = await request(app).patch(`/me/follow-requests/${userB.id}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.follower.status).toBe("ACCEPTED")
    })

    it("should respond with 404 Not Found when attempting to accept a follow request that does not exist", async () => {
        const userId = "FakeUserId"
        const res = await request(app).patch(`/me/follow-requests/${userId}`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
        expect(res.body.message).toBe("No record found")
    })
})

describe("DELETE /me/follow-requests/:userId", () => {
    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    // UserB sends a follow request to userA
    beforeEach(async () => await prisma.follow.create({ data: { fromId: userB.id, toId: userA.id } }))
    afterEach(async () => await prisma.follow.deleteMany({}))

    it("should successfully reject/delete a pending follow request and return 204 No Content", async () => {
        const res = await request(app).delete(`/me/follow-requests/${userB.id}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(204)
    })

    it("should respond with 404 Not Found when attempting to reject a follow request that does not exist", async () => {
        const userId = "FakeUserId"
        const res = await request(app).delete(`/me/follow-requests/${userId}`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
        expect(res.body.message).toBe("No record found")
    })
})

describe("DELETE /me/followers/:userId", () => {
    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    // UserB follows userA
    beforeEach(async () => await prisma.follow.create({ data: { fromId: userB.id, toId: userA.id, status: "ACCEPTED" } }))
    afterEach(async () => await prisma.follow.deleteMany({}))

    it("should successfully remove an existing follower from the user's follower list and return 204 No Content", async () => {
        const res = await request(app).delete(`/me/followers/${userB.id}`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })

    it("should respond with 404 Not Found when attempting to remove a follower who is not actually following the user", async () => {
        const userId = "FakeUserId"
        const res = await request(app).delete(`/me/followers/${userId}`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
        expect(res.body.message).toBe("No record found")
    })
})