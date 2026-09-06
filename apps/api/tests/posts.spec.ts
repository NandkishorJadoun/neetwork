import app from '../src/app.js'
import { expect, describe, it, beforeAll, afterAll, afterEach, beforeEach } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { createMockPost } from "../src/scripts/mock-data.js"
import { randomUUIDv7 } from 'crypto';
import { clearDb, testAuth } from './helpers.test.js';
import type { TestHelpers } from 'better-auth/plugins';
import type { User } from 'better-auth';
import type { Post } from '../generated/prisma';

let test: TestHelpers;
let users: User[];
let posts: Post[];
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

  posts = users.flatMap(user => Array
    .from({ length: 2 })
    .map(() => createMockPost(user.id))
  )

  await prisma.post.createMany({ data: posts })

  const userA = users[0];
  const cookied = (await test.getAuthHeaders({ userId: userA.id })).get("cookie")
  if (!cookied) {
    throw new Error("Cookie not found");
  }

  cookie = cookied;
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

/* describe("POST /api/posts", () => {

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
}) */

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

/* describe("POST /api/posts/:postId", () => {

  afterEach(async () => await prisma.comment.deleteMany())

  it("should send 422 status with validation object error when comment cant get past schema validation", async () => {
    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}`)
      .set("Cookie", cookie)
      .send({ content: "" })

    expect(res.status).toBe(422)
    expect(res.body.errors).toContainEqual({ fieldName: "content", message: "Comment cannot be empty" })
  })

  it("should create and successfully return comment with status 201 Created", async () => {

    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}`)
      .set("Cookie", cookie)
      .send({ content: "This is a comment!" })

    expect(res.status).toBe(201)
    expect(res.body.comment.text).toEqual("This is a comment!")
  })
}) */

describe("POST /api/posts/:postId/like", () => {

  afterEach(async () => await prisma.like.deleteMany())

  it("should send 201 status when liking the post", async () => {

    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}/like`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
  })

  it("should send 409 status for liking the post multiple times", async () => {
    const post = posts[0];

    await prisma.like.create({
      data: {
        userId: users[0].id,
        postId: post.id
      }
    })

    const res = await request(app)
      .post(`/api/posts/${post.id}/like`)
      .set("Cookie", cookie)

    expect(res.status).toBe(409)
    expect(res.body.message).toBe("You can't like a post multiple times.")
  })
})

describe("DELETE /api/posts/:postId/like", () => {
  
  beforeEach(async () => await prisma.like.create({
    data: {
      postId: posts[0].id,
      userId: users[0].id
    }
  }))

  afterEach(async () => await prisma.like.deleteMany())

  it("will send 404 status if no record found for delete operation", async () => {
    const postId = "FakePostId"
    const res = await request(app)
      .delete(`/api/posts/${postId}/like`)
      .set("Cookie", cookie)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Invalid Post ID")
  })

  it("should successfully remove the like from the post and send 204 status", async () => {
    const res = await request(app)
      .delete(`/api/posts/${posts[0].id}/like`)
      .set("Cookie", cookie)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})