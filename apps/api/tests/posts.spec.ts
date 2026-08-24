import app from '../src/app'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma"
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
    expect(res.body.post).toMatchObject(post)
  })
})

describe("DELETE /posts/:postId", () => {
  const [user] = mockUsers;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  afterEach(async () => await prisma.comment.deleteMany({}))

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

describe("POST /posts/:postId", () => {
  const [user] = mockUsers;
  const [post] = mockPosts;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  afterEach(async () => await prisma.comment.deleteMany({}))

  it("should send 422 status with validation object error when comment cant get past schema validation", async () => {
    const res = await request(app)
      .post(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "" })

    expect(res.status).toBe(422)
    expect(res.body.errors).toContainEqual({ fieldName: "content", message: "Comment cannot be empty" })
  })

  it("should create and successfully return comment with status 201 Created", async () => {
    const res = await request(app)
      .post(`/posts/${post.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: "This is a comment!" })

    expect(res.status).toBe(201)
    expect(res.body.comment.text).toEqual("This is a comment!")
  })
})

describe("POST /posts/:postId/like", () => {
  const [user] = mockUsers;
  const [post] = mockPosts;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  afterEach(async () => await prisma.like.deleteMany({}))

  it("should send 201 status when liking the post", async () => {
    const res = await request(app)
      .post(`/posts/${post.id}/like`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(201)
  })

  it("should send 409 status for liking the post multiple times", async () => {

    await prisma.like.create({
      data: {
        userId: user.id,
        postId: post.id
      }
    })

    const res = await request(app)
      .post(`/posts/${post.id}/like`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe("You can't like a post multiple times.")
  })
})

describe("DELETE /posts/:postId/like", () => {
  const [user] = mockUsers;
  const [post] = mockPosts;
  const token = jwt.sign({ id: user.id }, env.JWT_SECRET_KEY);

  beforeEach(async () => await prisma.like.create({
    data: {
      postId: post.id,
      userId: user.id
    }
  }))

  afterEach(async () => await prisma.like.deleteMany({}))

  it("will send 404 status if no record found for delete operation", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .delete(`/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("No record found.")
  })

  it("should successfully remove the like from the post and send 204 status", async () => {
    const res = await request(app)
      .delete(`/posts/${post.id}/like`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)
  })
})