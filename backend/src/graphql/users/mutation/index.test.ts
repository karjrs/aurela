import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app.js";

const query = (query: string, variables?: Record<string, unknown>) =>
  request(app).post("/api/graphql").send({ query, variables });

describe("createUser", () => {
  it("creates and returns a new user", async () => {
    const res = await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id name email }
      }`,
      { input: { name: "Grace Hopper", email: "grace@example.com" } },
    );

    expect(res.status).toBe(200);
    expect(res.body.data.createUser).toMatchObject({
      name: "Grace Hopper",
      email: "grace@example.com",
    });
    expect(res.body.data.createUser.id).toBeTruthy();
  });
});

describe("updateUser", () => {
  it("updates an existing user", async () => {
    const created = await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id }
      }`,
      { input: { name: "Katherine Johnson", email: "kj@example.com" } },
    );
    const id = created.body.data.createUser.id as string;

    const res = await query(
      `mutation Update($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) { id name email }
      }`,
      { id, input: { name: "K. Johnson" } },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: {
        updateUser: { id, name: "K. Johnson", email: "kj@example.com" },
      },
    });
  });

  it("returns null for an unknown id", async () => {
    const res = await query(
      `mutation Update($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) { id }
      }`,
      { id: "999", input: { name: "Nobody" } },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { updateUser: null } });
  });
});

describe("deleteUser", () => {
  it("deletes an existing user", async () => {
    const created = await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id }
      }`,
      { input: { name: "Margaret Hamilton", email: "mh@example.com" } },
    );
    const id = created.body.data.createUser.id as string;

    const res = await query(
      `mutation Delete($id: ID!) { deleteUser(id: $id) }`,
      { id },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { deleteUser: true } });

    const afterDelete = await query(
      `query GetUser($id: ID!) { user(id: $id) { id } }`,
      { id },
    );
    expect(afterDelete.body).toEqual({ data: { user: null } });
  });

  it("returns false for an unknown id", async () => {
    const res = await query(
      `mutation Delete($id: ID!) { deleteUser(id: $id) }`,
      { id: "999" },
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { deleteUser: false } });
  });
});
