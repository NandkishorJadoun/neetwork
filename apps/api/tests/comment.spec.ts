import app from '../src/app.js'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { prisma } from '../src/configs/prisma';
import request from "supertest";
import type { User } from 'better-auth';
import type { Post } from '../generated/prisma';
import { setupTestUsers } from './helpers.js';
import { createMockPost } from '../src/scripts/mock-data.js';

let users: User[];
let posts: Post[];
let cookie: string;

beforeAll(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;

  const post = await prisma.post.create({
    data: createMockPost(users[0].id)
  })

  posts = [post];
})

afterAll(async () => prisma.$disconnect())

describe.todo("POST /api/posts/:postId/comment", () => {

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
})
