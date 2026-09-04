import app from '../src/app'
import { expect, describe, it } from 'vitest'
import request from "supertest"

describe("GET /auth/guest", () => {
    it("return token and guest user id", async () => {
        const res = await request(app).get("/auth/guest")

        expect(res.status).toBe(200)
        expect(res.body).toMatchObject({
            token: expect.any(String),
            id: expect.any(String)
        })
    })
})