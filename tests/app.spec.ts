import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("app", () => {
  it("should return 200 status code", async () => {
    // ACT
    const res = await request(app).get("/");
    // ASSERT
    expect(res.statusCode).toBe(200);
  });
});
