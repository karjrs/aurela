import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../../app.js";

const query = (query: string, variables?: Record<string, unknown>) =>
  request(app).post("/api/graphql").send({ query, variables });

const findSeededId = async (email: string) => {
  const res = await query(`query { users { id email } }`);
  const user = res.body.data.users.find(
    (u: { email: string }) => u.email === email,
  );
  return user.id as string;
};

describe("user", () => {
  it("returns the requested user", async () => {
    const id = await findSeededId("ada@example.com");

    const res = await query(
      `query GetUser($id: ID!) {
        user(id: $id) { id name email }
      }`,
      { id },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        user: { id, name: "Ada Lovelace", email: "ada@example.com" },
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
    const res = await query(`query { users { email } }`);

    expect(res.status).toBe(200);
    expect(res.body.data.users).toEqual(
      expect.arrayContaining([
        { email: "ada@example.com" },
        { email: "alan@example.com" },
      ]),
    );
  });
});
