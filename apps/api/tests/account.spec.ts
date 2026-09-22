import type { User } from "better-auth";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import request from "supertest";
import app from "../src/app.js";
import { prisma } from "../src/configs/prisma.js";
import { setupTestUsers } from "./helpers.js";

let users: User[];
let cookie: string;

before(async () => {
  const ctx = await setupTestUsers(5);
  users = ctx.users;
  cookie = ctx.cookie;
});

after(async () => prisma.$disconnect());

describe("GET /api/account", () => {
  it("should respond with 200 and user profile data", async () => {
    const user = users[0];

    const res = await request(app)
      .get("/api/account")
      .set("Cookie", cookie);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.id, user.id);
  });
});

describe("PATCH /api/account", () => {
  it("should respond with 422 Unprocessable Entity and a validation error when the 'fullname' field is empty", async () => {
    const res = await request(app)
      .patch("/api/account")
      .set("Cookie", cookie)
      .send({ fullname: "", about: "Lorem ipsum" });

    const fullnameError = res.body.errors.find((e: { fieldName: string }) => e.fieldName === "fullname");

    assert.strictEqual(res.status, 422);
    assert.strictEqual(fullnameError.message, "Name field can't be empty");
  });

  it("should respond with 200 OK and return the updated user profile when valid JSON data is provided", async () => {
    const res = await request(app)
      .patch("/api/account")
      .set("Cookie", cookie)
      .send({ fullname: "John doe", about: "Lorem ipsum" });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.user.name, "John doe");
    assert.strictEqual(res.body.user.about, "Lorem ipsum");
  });

  it("should store null when about is an empty string", async () => {
    const res = await request(app)
      .patch("/api/account")
      .set("Cookie", cookie)
      .send({ fullname: "John doe", about: "" });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.user.about, null);
  });
});
