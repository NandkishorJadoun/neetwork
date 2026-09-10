import app from '../src/app.js'
import { expect, describe, it, beforeAll, afterAll, afterEach } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { createMockPost } from "../src/scripts/mock-data.js"
import { setupTestUsers } from './helpers.js';
import type { User } from 'better-auth';
import type { Post } from '../generated/prisma';

let users: User[];
let posts: Post[];
let cookie: string;

beforeAll(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;

  const mockPosts = users.flatMap(user => Array
    .from({ length: 2 })
    .map(() => createMockPost(user.id))
  )

  await prisma.post.createMany({ data: mockPosts })

  posts = mockPosts as Post[];
})

afterAll(async () => prisma.$disconnect())

describe("GET /api/posts", () => {

  it("show all the posts sort by latest", async () => {

    const res = await request(app)
      .get("/api/posts")
      .set("Cookie", cookie)

    const latestPost = posts.reduce((latest, current) => {
      return current.created_at > latest.created_at ? current : latest;
    });

    expect(res.status).toBe(200)
    expect(res.body.posts.length).toEqual(10)
    expect(res.body.posts[0].text).toBe(latestPost.text)
  })
})

describe.todo("POST /api/posts", () => {

  it("should send 422 status with validation object error when post cant get past validation", async () => {

    const res = await request(app)
      .post("/api/posts")
      .set("Cookie", cookie)
      .send({ content: "" })

    expect(res.status).toBe(422)
    expect(res.body.errors).toContainEqual({ fieldName: "content", message: "Post cannot be empty" })
  })

  it("should create and successfully return post with status 201 Created", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Cookie", cookie)
      .send({ content: "This is a post!" })

    expect(res.status).toBe(201)
    expect(res.body.post.text).toEqual("This is a post!")
  })
})

describe("GET /api/posts/:postId", () => {

  it("should send 404 Not found error if no post found", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid Post ID")
  })

  it("should send 200 status with post data", async () => {
    const post = posts[0];
    const res = await request(app)
      .get(`/api/posts/${post.id}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.post.id).toBe(post.id)
  })
})

describe("DELETE /api/posts/:postId", () => {

  afterEach(async () => await prisma.comment.deleteMany())

  it("should respond with 404 Not Found when attempting to delete a post that does not exist", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid Post ID")
  })

  it("should successfully delete post and send status 204", async () => {
    const post = await prisma.post.create({
      data: createMockPost(users[0].id)
    })

    const res = await request(app)
      .delete(`/api/posts/${post.id}`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
