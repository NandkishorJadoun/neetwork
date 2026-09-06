import app from '../src/app.js'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach, vi } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { clearDb, testAuth } from './helpers.test.js';
import type { TestHelpers } from 'better-auth/plugins';
import type { User } from 'better-auth';
import { randomUUIDv7 } from 'crypto';
import type { Follow } from '../generated/prisma';

// mock uploadOnCloudinary function

vi.mock("../src/configs/cloudinary", () => {
  return {
    uploadOnCloudinary: vi.fn().mockResolvedValue({
      secure_url: "https://cloudinary.com"
    })
  }
})

let test: TestHelpers;
let users: User[];
let cookie: string;

beforeAll(async () => {

  await clearDb()

  test = (await testAuth.$context).test

  users = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      test.saveUser(test.createUser({
        id: randomUUIDv7(),
        email: `user${i}@example.com`,
        name: `User ${i}`
      }))
    )
  )

  const userA = users[0];
  const cookied = (await test.getAuthHeaders({ userId: userA.id })).get("cookie")
  if (!cookied) {
    throw new Error("Cookie not found");
  }

  cookie = cookied;
})

afterAll(async () => prisma.$disconnect())

describe("GET /api/me", () => {
  it("should respond with 200 and user profile data", async () => {
    const user = users[0];

    const res = await request(app)
      .get("/api/me")
      .set("Cookie", cookie)

    expect(res.status).toEqual(200)
    expect(res.body.user.id).toEqual(user.id)
  })
})

/* describe("PATCH /api/me", () => {
    const [user] = users;
 
    it("should respond with 422 Unprocessable Entity and a validation error when the 'fullname' field is empty", async () => {
        const res = await request(app)
            .patch(`/api/me`)
            .set("Cookie", cookie)
            .field("fullname", "")
            .field("about", "Lorem ipsum")
 
        const fullnameError = res.body.errors.find((e: ValidationError) => e.fieldName === "fullname")
 
        expect(res.status).toBe(422)
        expect(fullnameError.message).toBe("Name field can't be empty")
    })
 
    it("should respond with 200 OK and return the updated user profile when valid text data is provided", async () => {
        const res = await request(app)
            .patch(`/api/me`)
            .set("Cookie", cookie)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
 
        expect(res.status).toBe(200)
        expect(res.body.user.fullname).toBe("John doe")
        expect(res.body.user.about).toBe("Lorem ipsum")
    })
 
    it("should respond with 415 Unsupported Media Type when the uploaded avatar file is not an image", async () => {
        const mockBuffer = Buffer.from('mock-data');
 
        const res = await request(app)
            .patch(`/api/me`)
            .set("Cookie", cookie)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'video.mp4')
 
        expect(res.status).toBe(415)
    })
 
    it("should successfully update and return the new avatar URL when a valid image file is uploaded", async () => {
        const mockBuffer = Buffer.from('mock-data');
 
        const res = await request(app)
            .patch(`/api/me`)
            .set("Cookie", cookie)
            .field("fullname", "John doe")
            .field("about", "Lorem ipsum")
            .attach('avatar', mockBuffer, 'image.png')
 
        expect(res.status).toBe(200)
        expect(res.body.user.avatar).toBe("https://cloudinary.com")
    })
}) */

describe("GET /api/me/follow-requests", () => {

  beforeEach(async () => {
    const [userA, userB, userC] = users;
    await prisma.follow.createMany({
      data: [
        { senderId: userA.id, receiverId: userB.id },
        { senderId: userA.id, receiverId: userC.id },
        { senderId: userB.id, receiverId: userC.id }
      ]
    })
  })

  afterEach(async () => await prisma.follow.deleteMany())

  it("should return a list of all incoming follow requests for a user with multiple pending requests", async () => {

    const [userA, userB] = users;

    const cookie = (await test.getAuthHeaders({ userId: users[2].id })).get("cookie")

    if (!cookie) {
      throw new Error("Cookie not found");
    }

    const res = await request(app)
      .get("/api/me/follow-requests")
      .set("Cookie", cookie)

    const followRequests = res.body.followRequests
      .map((e: Follow) => e.senderId)

    expect(res.status).toBe(200)
    expect(res.body.followRequests.length).toBe(2)
    expect(followRequests).toEqual([userA.id, userB.id])
  })

  it("should return an empty array when the authenticated user has no pending incoming follow requests", async () => {

    const res = await request(app)
      .get("/api/me/follow-requests")
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.followRequests.length).toBe(0)
  })
})

describe("PATCH /api/me/follow-requests/:userId", () => {

  // UserB sends a follow request to userA
  beforeEach(async () => {
    const [userA, userB] = users;

    await prisma.follow.create({
      data: {
        senderId: userB.id,
        receiverId: userA.id
      }
    })
  })
  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully accept a pending follow request and update its status to ACCEPTED", async () => {

    const userB = users[1]

    const res = await request(app)
      .patch(`/api/me/follow-requests/${userB.id}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it("should respond with 404 Not Found when attempting to accept a follow request that does not exist", async () => {

    const userId = "FakeUserId"

    const res = await request(app)
      .patch(`/api/me/follow-requests/${userId}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid User ID")
  })
})

describe("DELETE /api/me/follow-requests/:userId", () => {

  // UserB sends a follow request to userA
  beforeEach(async () => {
    const [userA, userB] = users;
    await prisma.follow.create({ data: { senderId: userB.id, receiverId: userA.id } })
  })

  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully reject/delete a pending follow request and return 200 No Content", async () => {

    const userB = users[1];

    const res = await request(app)
      .delete(`/api/me/follow-requests/${userB.id}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it("should respond with 404 Not Found when attempting to reject a follow request that does not exist", async () => {

    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/me/follow-requests/${userId}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid User ID")

  })
})

describe("DELETE /api/me/followers/:userId", () => {

  // UserB follows userA
  beforeEach(async () => {

    const [userA, userB] = users;
    await prisma.follow.create({ data: { senderId: userB.id, receiverId: userA.id, status: "ACCEPTED" } })
  })
  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully remove an existing follower from the user's follower list and return 200 No Content", async () => {

    const userB = users[1];

    const res = await request(app)
      .delete(`/api/me/followers/${userB.id}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
  })

  it("should respond with 404 Not Found when attempting to remove a follower who is not actually following the user", async () => {
    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/me/followers/${userId}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid User ID")
  })
})