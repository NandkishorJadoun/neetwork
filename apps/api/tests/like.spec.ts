import app from '../src/app.js'
import { describe, it, before, after, afterEach, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { createMockPost } from "../src/scripts/mock-data.js"
import { setupTestUsers } from './helpers.js';
import type { User } from 'better-auth';
import type { Post } from '../generated/prisma';

let users: User[];
let posts: Post[];
let cookie: string;

before(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;

  const post = await prisma.post.create({
    data: createMockPost(users[0].id)
  })

  posts = [post];
})

after(async () => prisma.$disconnect())

describe("POST /api/posts/:postId/like", () => {

  afterEach(async () => await prisma.like.deleteMany())

  it("should send 201 status when liking the post", async () => {

    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}/like`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
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

    assert.strictEqual(res.status, 409)
    assert.strictEqual(res.body.message, "You can't like a post multiple times.")
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

    assert.strictEqual(res.status, 404)
    assert.strictEqual(res.body.message, "Invalid Post ID")
  })

  it("should successfully remove the like from the post and send 204 status", async () => {
    const res = await request(app)
      .delete(`/api/posts/${posts[0].id}/like`)
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.success, true)
  })
})
