import app from '../src/app.js'
import { describe, it, before, afterEach, after } from 'node:test'
import assert from 'node:assert/strict'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { setupTestUsers } from './helpers.js';
import type { User } from 'better-auth';
import { createMockPost } from "../src/scripts/mock-data.js"

let users: User[];
let cookie: string;

before(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;
})

after(async () => prisma.$disconnect())

describe("GET /users", () => {

  afterEach(async () => await prisma.follow.deleteMany())

  it("shows all users when the user has not sent any follow requests", async () => {

    const res = await request(app)
      .get("/api/users")
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.users.length, 4);
  });

  it("does not show users who the current user has already sent a follow request to", async () => {
    const [userA, userB] = users;

    await prisma.follow.create({
      data: {
        senderId: userA.id,
        receiverId: userB.id,
      },
    });

    const res = await request(app)
      .get("/api/users")
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.users.length, 3);
  });
});

describe("GET /users/:userId", () => {
  it("will send 400 if user id is invalid", async () => {
    // fetching user from id that dont exist
    const userId = "FakeUserId"
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 400)
    assert.strictEqual(res.body.message, "Invalid User ID")
  })

  it("will send the user info", async () => {
    const userB = users[1];

    const res = await request(app)
      .get(`/api/users/${userB.id}`)
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.user.id, userB.id)
    assert.strictEqual(res.body.user.name, userB.name)
  })
})

describe("GET /users/:userId/posts", () => {
  afterEach(async () => await prisma.post.deleteMany())

  it("will send all the user's posts", async () => {
    const userB = users[1];
    const mockPosts = Array.from({ length: 2 }).map(() => createMockPost(userB.id));
    await prisma.post.createMany({ data: mockPosts })

    const res = await request(app)
      .get(`/api/users/${userB.id}/posts`)
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.posts.length, 2)
  })
})

describe("GET /users/:userId/comments", () => {
  afterEach(async () => {
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
  })


  it("will send all the user's comment", async () => {

    const [userA, userB] = users;
    const mockPost = createMockPost(userA.id);
    await prisma.post.create({ data: mockPost })

    // User B mock comments on mock post

    await prisma.comment.createMany({
      data: [
        { userId: userB.id, postId: mockPost.id, text: "First Comment" },
        { userId: userB.id, postId: mockPost.id, text: "Second Comment" }
      ]
    })

    const res = await request(app)
      .get(`/api/users/${userB.id}/comments`).
      set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.comments.length, 2)
    assert.ok(res.body.comments.some((c: { text: string }) => c.text === 'First Comment'))
    assert.ok(res.body.comments.some((c: { text: string }) => c.text === 'Second Comment'))
  })
})

describe("GET /users/:userId/likes", () => {
  afterEach(async () => {
    await prisma.like.deleteMany()
    await prisma.post.deleteMany()
  })

  it("will send all the posts that user have liked", async () => {
    const [userA, userB] = users;
    const mockPosts = Array.from({ length: 5 }).map(() => createMockPost(userA.id));

    await prisma.post.createMany({ data: mockPosts })

    // userB liked 2 posts

    await prisma.like.createMany({
      data: [
        { postId: mockPosts[1].id, userId: userB.id },
        { postId: mockPosts[4].id, userId: userB.id }
      ]
    })

    const res = await request(app)
      .get(`/api/users/${userB.id}/likes`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.likes.length, 2)
  })
})

describe("GET /users/:userId/followers", () => {
  afterEach(async () => await prisma.follow.deleteMany())

  it("will return all the followers of user", async () => {
    const [userA, userB, userC] = users;

    await prisma.follow.createMany({
      data: [
        { senderId: userA.id, receiverId: userB.id, status: "ACCEPTED" },
        { senderId: userC.id, receiverId: userB.id, status: "ACCEPTED" },
      ]
    })

    const res = await request(app).get(`/api/users/${userB.id}/followers`).set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.followers.length, 2)
    assert.ok(res.body.followers.some((f: { senderId: string }) => f.senderId === userA.id))
    assert.ok(res.body.followers.some((f: { senderId: string }) => f.senderId === userC.id))
  })
})

describe("GET /users/:userId/followings", () => {
  afterEach(async () => await prisma.follow.deleteMany())

  it("will return all the followings of user", async () => {

    const [userA, userB, userC] = users;

    await prisma.follow.createMany({
      data: [
        { senderId: userB.id, receiverId: userA.id, status: "ACCEPTED" },
        { senderId: userB.id, receiverId: userC.id, status: "ACCEPTED" },
      ]
    })

    const res = await request(app)
      .get(`/api/users/${userB.id}/followings`)
      .set('Cookie', cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.followings.length, 2)
    assert.ok(res.body.followings.some((f: { receiverId: string }) => f.receiverId === userA.id))
    assert.ok(res.body.followings.some((f: { receiverId: string }) => f.receiverId === userC.id))
  })
})
