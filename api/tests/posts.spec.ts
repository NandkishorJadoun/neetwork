import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import request from "supertest"
import { prisma } from "../src/libs/prisma"
import { createMockUser, createMockPost } from "../src/scripts/mock-data"
import { env } from '../src/schemas/env.schema'
import jwt from "jsonwebtoken"

const mockUsers = Array.from({ length: 5 }).map(() => createMockUser());
const mockPosts = mockUsers.flatMap(user => Array.from({ length: 2 }).map(() => createMockPost(user.id)))

beforeAll(async () => await prisma.$transaction([prisma.user.createMany({ data: mockUsers }), prisma.post.createMany({ data: mockPosts })]))
afterAll(async () => await prisma.$transaction([prisma.post.deleteMany({}), prisma.user.deleteMany({})]))

describe("GET /posts", () => {
  const [user] = mockUsers;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  it("show all the posts sort by latest", async () => {
    const res = await request(app).get("/posts").set('Authorization', `Bearer ${token}`)
    const latestPost = mockPosts.reduce((latest, current) => {
      return current.created_at > latest.created_at ? current : latest;
    });

    expect(res.status).toBe(200)
    expect(res.body.posts.length).toEqual(10)
    expect(res.body.posts[0].created_at).toBe(latestPost.created_at)
  })
})

describe("GET /posts/following", () => {
  const [userA, userB, userC] = mockUsers;
  const token = jwt.sign({ id: userA.id }, env.JWT_SECRET_KEY);

  beforeEach(async () => {
    await prisma.follow.createMany({
      data: [
        { fromId: userA.id, toId: userB.id, status: "ACCEPTED" },
        { fromId: userA.id, toId: userC.id, status: "ACCEPTED" }
      ]
    })
  })

  afterEach(async () => await prisma.follow.deleteMany({}))

  it("should show all the posts from user whom he is following sort by latest", async () => {
    const res = await request(app).get("/posts/following").set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.posts.length).toEqual(6)
  })
})

describe("POST /posts", () => {
  const [user] = mockUsers;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  it("should send 422 status with validation object error when post cant get past validation", async () => {
    const res = await request(app)
      .post("/posts")
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "" })

    expect(res.status).toBe(422)
    expect(res.body.errors).toContainEqual({ fieldName: "content", message: "Post cannot be empty" })
  })

  it("should create and successfully return post with status 201 Created", async () => {
    const res = await request(app)
      .post("/posts")
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "This is a post!" })

    expect(res.status).toBe(201)
    expect(res.body.post.text).toEqual("This is a post!")
  })
})

describe("GET /posts/:postId", () => {
  const [user] = mockUsers;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  it("should send 404 Not found error if no post found", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .get(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe(`Post with ID "${postId}" not found`)
  })

  it("should send 200 status with post data", async () => {
    const [post] = mockPosts;
    const res = await request(app)
      .get(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.post).toEqual(post)
  })
})

describe("DELETE /posts/:postId", () => {
  const [user] = mockUsers;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  afterEach(async () => await prisma.post.deleteMany({}))

  it("should respond with 404 Not Found when attempting to delete a post that does not exist", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .delete(`/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("No record found")
  })

  it("should successfully delete post and send status 204", async () => {
    const post = await prisma.post.create({ data: createMockPost(user.id) })

    const res = await request(app)
      .delete(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })
})