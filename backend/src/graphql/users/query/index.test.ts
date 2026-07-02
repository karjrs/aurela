import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app.js";

const query = (query: string, variables?: Record<string, unknown>) =>
  request(app).post("/api/graphql").send({ query, variables });

describe("user", () => {
  it("returns the requested user", async () => {
    const res = await query(
      `query GetUser($id: ID!) {
        user(id: $id) { id name email }
      }`,
      { id: "1" },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        user: { id: "1", name: "Ada Lovelace", email: "ada@example.com" },
      },
    });
  });

  it("returns null for an unknown id", async () => {
    const res = await query(`query { user(id: "999") { id } }`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { user: null } });
  });
});

describe("users", () => {
  it("returns the seeded users", async () => {
    const res = await query(`query { users { id } }`);

    expect(res.status).toBe(200);
    expect(res.body.data.users).toEqual(
      expect.arrayContaining([{ id: "1" }, { id: "2" }]),
    );
  });
});
