import app from '../src/app.js'
import { describe, it, before, afterEach, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { getCookieForUser, setupTestUsers } from './helpers.js';
import type { TestHelpers } from 'better-auth/plugins';
import type { User } from 'better-auth';
import type { Follow } from '../generated/prisma';

let test: TestHelpers;
let users: User[];
let cookie: string;

before(async () => {
  const ctx = await setupTestUsers(5);
  test = ctx.test;
  users = ctx.users;
  cookie = ctx.cookie;
})

after(async () => prisma.$disconnect())

describe("POST /api/follow/:userId", () => {
  afterEach(async () => await prisma.follow.deleteMany())

  it("will send a follow request", async () => {
    const userB = users[1];

    const res = await request(app)
      .post(`/api/follow/${userB.id}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
  })

  it("will send 409 status for sending multiple follow request to a user", async () => {
    const userB = users[1];

    await request(app)
      .post(`/api/follow/${userB.id}`)
      .set('Cookie', cookie)

    const res = await request(app)
      .post(`/api/follow/${userB.id}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 409)
  })
})

describe("DELETE /api/follow/:userId (cancel sent follow request)", () => {

  beforeEach(async () => await prisma.follow.create({ data: { senderId: users[0].id, receiverId: users[1].id } }))
  afterEach(async () => await prisma.follow.deleteMany())

  it("will delete the sent follow request", async () => {

    const userB = users[1];
    const res = await request(app)
      .delete(`/api/follow/${userB.id}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })

  it("will send 404 status if no record found for delete operation", async () => {
    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/follow/${userId}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 400)
  })
})

describe("DELETE /api/follow/:userId (unfollow)", () => {

  beforeEach(async () => await prisma.follow.create({ data: { senderId: users[0].id, receiverId: users[1].id, status: "ACCEPTED" } }))
  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully remove an existing user from the user's following list and return 204 No Content", async () => {

    const userB = users[1];
    const res = await request(app)
      .delete(`/api/follow/${userB.id}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })

  it("should respond with 404 Not Found when attempting to remove a user whom the user is not following", async () => {
    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/follow/${userId}`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 400)
  })
})

describe("GET /api/follow-requests", () => {

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

    const cookie = await getCookieForUser(test, users[2].id)

    const res = await request(app)
      .get("/api/follow-requests")
      .set("Cookie", cookie)

    const followRequests = res.body.followRequests
      .map((e: Follow) => e.senderId)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.followRequests.length, 2)
    assert.deepStrictEqual(followRequests, [userA.id, userB.id])
  })

  it("should return an empty array when the authenticated user has no pending incoming follow requests", async () => {

    const res = await request(app)
      .get("/api/follow-requests")
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.followRequests.length, 0)
  })
})

describe("PATCH /api/follow-requests/:userId", () => {

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
      .patch(`/api/follow-requests/${userB.id}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })

  it("should respond with 404 Not Found when attempting to accept a follow request that does not exist", async () => {

    const userId = "FakeUserId"

    const res = await request(app)
      .patch(`/api/follow-requests/${userId}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.message, "Invalid User ID")
  })
})

describe("DELETE /api/follow-requests/:userId", () => {

  // UserB sends a follow request to userA
  beforeEach(async () => {
    const [userA, userB] = users;
    await prisma.follow.create({ data: { senderId: userB.id, receiverId: userA.id } })
  })

  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully reject/delete a pending follow request and return 200 No Content", async () => {

    const userB = users[1];

    const res = await request(app)
      .delete(`/api/follow-requests/${userB.id}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })

  it("should respond with 404 Not Found when attempting to reject a follow request that does not exist", async () => {

    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/follow-requests/${userId}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.message, "Invalid User ID")

  })
})

describe("DELETE /api/followers/:userId", () => {

  // UserB follows userA
  beforeEach(async () => {

    const [userA, userB] = users;
    await prisma.follow.create({ data: { senderId: userB.id, receiverId: userA.id, status: "ACCEPTED" } })
  })
  afterEach(async () => await prisma.follow.deleteMany())

  it("should successfully remove an existing follower from the user's follower list and return 200 No Content", async () => {

    const userB = users[1];

    const res = await request(app)
      .delete(`/api/followers/${userB.id}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
  })

  it("should respond with 404 Not Found when attempting to remove a follower who is not actually following the user", async () => {
    const userId = "FakeUserId"

    const res = await request(app)
      .delete(`/api/followers/${userId}`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.message, "Invalid User ID")
  })
})
