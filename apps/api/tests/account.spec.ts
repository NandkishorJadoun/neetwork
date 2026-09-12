import app from '../src/app.js'
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { setupTestUsers } from './helpers.js';
import type { User } from 'better-auth';
import type { UploadValidationError } from '../src/configs/multer.js';

let users: User[];
let cookie: string;

before(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;
})

after(async () => prisma.$disconnect())

describe("GET /api/account", () => {
  it("should respond with 200 and user profile data", async () => {
    const user = users[0];

    const res = await request(app)
      .get("/api/account")
      .set("Cookie", cookie)

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.user.id, user.id)
  })
})

describe.todo("PATCH /api/account", () => {

  it("should respond with 422 Unprocessable Entity and a validation error when the 'fullname' field is empty", async () => {
    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "")
      .field("about", "Lorem ipsum")

    const fullnameError = res.body.errors.find((e: UploadValidationError) => e.field === "fullname")

    assert.strictEqual(res.status, 422)
    assert.strictEqual(fullnameError.message, "Name field can't be empty")
  })

  it("should respond with 200 OK and return the updated user profile when valid text data is provided", async () => {
    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.user.fullname, "John doe")
    assert.strictEqual(res.body.user.about, "Lorem ipsum")
  })

  it("should respond with 415 Unsupported Media Type when the uploaded avatar file is not an image", async () => {
    const mockBuffer = Buffer.from('mock-data');

    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")
      .attach('avatar', mockBuffer, 'video.mp4')

    assert.strictEqual(res.status, 415)
  })

  it("should successfully update and return the new avatar URL when a valid image file is uploaded", async () => {
    const mockBuffer = Buffer.from('mock-data');

    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")
      .attach('avatar', mockBuffer, 'image.png')

    assert.strictEqual(res.status, 200)
    assert.strictEqual(res.body.user.avatar, "https://cloudinary.com")
  })
})
