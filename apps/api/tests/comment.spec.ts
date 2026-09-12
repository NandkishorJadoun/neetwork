import app from '../src/app.js'
import { after, afterEach, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { prisma } from '../src/configs/prisma';
import request from "supertest";
import type { User } from 'better-auth';
import type { Post } from '../generated/prisma';
import { setupTestUsers } from './helpers.js';
import { createMockPost } from '../src/scripts/mock-data.js';

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

describe.todo("POST /api/posts/:postId/comment", () => {

  afterEach(async () => await prisma.comment.deleteMany())

  it("should send 422 status with validation object error when comment cant get past schema validation", async () => {
    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}`)
      .set("Cookie", cookie)
      .send({ content: "" })

    assert.strictEqual(res.status, 422)
    assert.ok(res.body.errors.some((e: { fieldName: string; message: string }) => e.fieldName === "content" && e.message === "Comment cannot be empty"))
  })

  it("should create and successfully return comment with status 201 Created", async () => {

    const post = posts[0];

    const res = await request(app)
      .post(`/api/posts/${post.id}`)
      .set("Cookie", cookie)
      .send({ content: "This is a comment!" })

    assert.strictEqual(res.status, 201)
    assert.strictEqual(res.body.comment.text, "This is a comment!")
  })
})
