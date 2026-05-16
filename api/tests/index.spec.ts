import app from "../src/app"
import { expect, test } from 'vitest'
import request from "supertest"

test("index route returns 200", async () => {
    const res = await request(app).get("/")

    expect(res.headers["content-type"]).match(/json/)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ message: "Server is running..." })
})