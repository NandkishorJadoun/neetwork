import app from '../src/app.js'
import { expect, describe, it, beforeAll, afterAll, vi } from 'vitest'
import request from "supertest"
import { prisma } from "../src/configs/prisma.js"
import { setupTestUsers } from './helpers.js';
import type { User } from 'better-auth';
import type { UploadValidationError } from '../src/configs/multer.js';

// mock uploadOnCloudinary function

vi.mock("../src/configs/cloudinary", () => {
  return {
    uploadOnCloudinary: vi.fn().mockResolvedValue({
      secure_url: "https://cloudinary.com"
    })
  }
})

let users: User[];
let cookie: string;

beforeAll(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;
})

afterAll(async () => prisma.$disconnect())

describe("GET /api/account", () => {
  it("should respond with 200 and user profile data", async () => {
    const user = users[0];

    const res = await request(app)
      .get("/api/account")
      .set("Cookie", cookie)

    expect(res.status).toEqual(200)
    expect(res.body.user.id).toEqual(user.id)
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

    expect(res.status).toBe(422)
    expect(fullnameError.message).toBe("Name field can't be empty")
  })

  it("should respond with 200 OK and return the updated user profile when valid text data is provided", async () => {
    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")

    expect(res.status).toBe(200)
    expect(res.body.user.fullname).toBe("John doe")
    expect(res.body.user.about).toBe("Lorem ipsum")
  })

  it("should respond with 415 Unsupported Media Type when the uploaded avatar file is not an image", async () => {
    const mockBuffer = Buffer.from('mock-data');

    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")
      .attach('avatar', mockBuffer, 'video.mp4')

    expect(res.status).toBe(415)
  })

  it("should successfully update and return the new avatar URL when a valid image file is uploaded", async () => {
    const mockBuffer = Buffer.from('mock-data');

    const res = await request(app)
      .patch(`/api/me`)
      .set("Cookie", cookie)
      .field("fullname", "John doe")
      .field("about", "Lorem ipsum")
      .attach('avatar', mockBuffer, 'image.png')

    expect(res.status).toBe(200)
    expect(res.body.user.avatar).toBe("https://cloudinary.com")
  })
})
