import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma"
import { createMockUser, createMockPost } from "../src/scripts/mock-data"
import { env } from '../src/schemas/env.schema'
import jwt from "jsonwebtoken"

const mockUsers = Array.from({ length: 5 }).map(() => createMockUser());

beforeAll(async () => await prisma.user.createMany({ data: mockUsers }))
afterAll(async () => await prisma.user.deleteMany({}))

describe("GET /users", () => {
  afterEach(async () => await prisma.follow.deleteMany({}))
  beforeEach(async () => await prisma.follow.deleteMany())
  const [userA, userB] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  it("show all users since user haven't send anyone a follow request yet", async () => {
    const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.users.length).toEqual(4)
  })

  it("show all users who exist on the platform but user haven't send follow request yet", async () => {
    // userA sending follow request to userB
    await prisma.follow.create({
      data: { fromId: userA.id, toId: userB.id }
    })

    const res = await request(app).get("/users").set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.users.length).toEqual(3)
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
    expect(res.body.user).toMatchObject(userB)
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

describe("GET /users/:userId/comments", () => {
  afterEach(async () => {
    await prisma.comment.deleteMany({})
    await prisma.post.deleteMany({})
  })

  const [userA, userB] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  it("will send all the user's comment", async () => {
    const mockPost = createMockPost(userA.id);
    await prisma.post.create({ data: mockPost })

    // User B mock comments on mock post

    await prisma.comment.createMany({
      data: [
        { userId: userB.id, postId: mockPost.id, text: "First Comment" },
        { userId: userB.id, postId: mockPost.id, text: "Second Comment" }
      ]
    })

    const res = await request(app).get(`/users/${userB.id}/comments`).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.comments.length).toEqual(2)
    expect(res.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ text: 'First Comment' }),
        expect.objectContaining({ text: 'Second Comment' })
      ])
    )
  })
})

describe("GET /users/:userId/likes", () => {
  afterEach(async () => {
    await prisma.like.deleteMany({})
    await prisma.post.deleteMany({})
  })

  const [userA, userB] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  it("will send all the posts that user have liked", async () => {
    const mockPosts = Array.from({ length: 5 }).map(() => createMockPost(userA.id));

    await prisma.post.createMany({ data: mockPosts })
    await prisma.like.createMany({ data: [{ postId: mockPosts[1].id, userId: userB.id }, { postId: mockPosts[4].id, userId: userB.id }] })

    const res = await request(app).get(`/users/${userB.id}/likes`).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.likes.length).toEqual(2)
  })
})

describe("GET /users/:userId/followers", () => {
  afterEach(async () => await prisma.follow.deleteMany({}))

  const [userA, userB, userC] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  it("will return all the followers of user", async () => {

    await prisma.follow.createMany({
      data: [
        { fromId: userA.id, toId: userB.id, status: "ACCEPTED" },
        { fromId: userC.id, toId: userB.id, status: "ACCEPTED" },
      ]
    })

    const res = await request(app).get(`/users/${userB.id}/followers`).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.followers.length).toEqual(2)
    expect(res.body.followers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fromId: userA.id }),
        expect.objectContaining({ fromId: userC.id })
      ])
    )

  })
})

describe("GET /users/:userId/followings", () => {
  afterEach(async () => await prisma.follow.deleteMany({}))

  const [userA, userB, userC] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  it("will return all the followings of user", async () => {

    await prisma.follow.createMany({
      data: [
        { fromId: userB.id, toId: userA.id, status: "ACCEPTED" },
        { fromId: userB.id, toId: userC.id, status: "ACCEPTED" },
      ]
    })

    const res = await request(app).get(`/users/${userB.id}/followings`).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.followings.length).toEqual(2)
    expect(res.body.followings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ toId: userA.id }),
        expect.objectContaining({ toId: userC.id })
      ])
    )
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
    const userId = "FakeUserId"
    const res = await request(app).delete(`/users/${userId}/follow-request`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})

describe("DELETE /users/:userId/follow", () => {
  const [userA, userB] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  beforeEach(async () => await prisma.follow.create({ data: { fromId: userA.id, toId: userB.id, status: "ACCEPTED" } }))
  afterEach(async () => await prisma.follow.deleteMany({}))

  it("should successfully remove an existing user from the user's following list and return 204 No Content", async () => {
    const res = await request(app).delete(`/users/${userB.id}/follow`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)
  })

  it("should respond with 404 Not Found when attempting to remove a user whom the user is not following", async () => {
    const userId = "FakeUserId"
    const res = await request(app).delete(`/users/${userId}/follow`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})