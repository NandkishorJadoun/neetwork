import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest'
import request from "supertest"
import { prisma } from "../src/libs/prisma"
import { createMockUser, createMockPost } from "../src/scripts/mock-data"
import { env } from '../src/schemas/env.schema'
import jwt from "jsonwebtoken"
import type { ValidationError } from "../src/types/index"
import type { Follow } from '@prisma/client'

// mock uploadOnCloudinary function

vi.mock("../src/utils/cloudinary", () => {
    return {
        uploadOnCloudinary: vi.fn().mockResolvedValue({
            secure_url: "https://cloudinary.com"
        })
    }
})

const mockUsers = Array.from({ length: 5 }).map(() => createMockUser());

beforeAll(async () => await prisma.user.createMany({ data: mockUsers }))
afterAll(async () => await prisma.user.deleteMany({}))

describe("GET /users", () => {
    afterEach(async () => await prisma.follow.deleteMany({}))

    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    it("show all users since user haven't send anyone a follow request yet", async () => {
        const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.users.length).toEqual(9)
    })

    it("show all users who exist on the platform but user haven't send follow request yet", async () => {
        // userA followed userB
        await prisma.follow.create({
            data: { fromId: userA.id, toId: userB.id }
        })

        const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.users.length).toEqual(8)
    })
})

describe("GET /users/:userId", () => {
    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    it("will send 404 if user don't exist", async () => {
        // fetching user from id that dont exist
        const userId = "FakeUserId"
        const res = await request(app).get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(404)
        expect(res.body.message).toBe(`User with ID "${userId}" not found`)
    })

    it("will send the user info", async () => {
        const res = await request(app).get(`/users/${userB.id}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.user).toEqual(userB)
    })
})

describe("GET /users/:userId/posts", () => {
    afterEach(async () => await prisma.post.deleteMany({}))

    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    it("will send all the user's posts", async () => {
        const mockPosts = Array.from({ length: 2 }).map(() => createMockPost(userB.id));
        await prisma.post.createMany({ data: mockPosts })
        const res = await request(app).get(`/users/${userB.id}/posts`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.posts.length).toEqual(2)
    })
})

describe("POST /users/:userId/follow-request", () => {
    afterEach(async () => await prisma.follow.deleteMany({}))

    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    it("will send a follow request", async () => {
        const res = await request(app).post(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.followRequest.fromId).toEqual(userA.id)
        expect(res.body.followRequest.toId).toEqual(userB.id)
        expect(res.body.followRequest.status).toEqual("PENDING")
    })

    it("will send 409 status for sending multiple follow request to a user", async () => {
        await request(app).post(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)
        const res = await request(app).post(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(409)
    })
})

describe("DELETE /users/:userId/follow-request", () => {
    const [userA, userB] = mockUsers;
    const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

    beforeEach(async () => await prisma.follow.create({ data: { fromId: userA.id, toId: userB.id } }))
    afterEach(async () => await prisma.follow.deleteMany({}))

    it("will delete the sent follow request", async () => {
        const res = await request(app).delete(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(204)
    })

    it("will send 404 status if no record found for delete operation", async () => {
        await request(app).delete(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)
        const res = await request(app).delete(`/users/${userB.id}/follow-request`).set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
    })
})

describe("PATCH /users/me", () => {
    const [user] = mockUsers;
    const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

    it("should respond with 422 Unprocessable Entity and a validation error when the 'fullname' field is empty", async () => {
        const res = await request(app)
            .patch(`/users/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "")
            .field("about", "Lorem ipsum")

        const fullnameError = res.body.errors.find((e: ValidationError) => e.fieldName === "fullname")

        expect(res.status).toBe(422)
        expect(fullnameError.message).toBe("Name field can't be empty")
    })

    it("should respond with 200 OK and return the updated user profile when valid text data is provided", async () => {
        const res = await request(app)
            .patch(`/users/me`)
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
            .patch(`/users/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'video.mp4')

        expect(res.status).toBe(415)
    })

    it("should successfully update and return the new avatar URL when a valid image file is uploaded", async () => {
        const mockBuffer = Buffer.from('mock-data');

        const res = await request(app)
            .patch(`/users/me`)
            .set('Authorization', `Bearer ${token}`)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'image.png')

        expect(res.status).toBe(200)
        expect(res.body.user.avatar).toBe("https://cloudinary.com")
    })
})

describe("GET /users/me/follow-requests", () => {
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
        const res = await request(app).get("/users/me/follow-requests").set('Authorization', `Bearer ${token}`)

        const followRequests = res.body.followRequests.map((e: Follow) => e.fromId)

        expect(res.status).toBe(200)
        expect(res.body.followRequests.length).toBe(2)
        expect(followRequests).toEqual([userA.id, userB.id])
    })

    it("should return an empty array when the authenticated user has no pending incoming follow requests", async () => {
        const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);
        const res = await request(app)
            .get("/users/me/follow-requests")
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.followRequests.length).toBe(0)
    })
})