import request from "supertest";
import { describe, expect, it } from "vitest";
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

  it("rejects an empty name", async () => {
    const res = await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id }
      }`,
      { input: { name: "  ", email: "valid@example.com" } },
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
    expect(res.body.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("rejects an invalid email format", async () => {
    const res = await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id }
      }`,
      { input: { name: "Valid Name", email: "not-an-email" } },
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toBeNull();
    expect(res.body.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("does not add a user to the array on validation failure", async () => {
    const before = await query(`query { users { id } }`);
    const beforeCount = before.body.data.users.length;

    await query(
      `mutation Create($input: CreateUserInput!) {
        createUser(input: $input) { id }
      }`,
      { input: { name: "", email: "bad" } },
    );

    const after = await query(`query { users { id } }`);
    expect(after.body.data.users.length).toBe(beforeCount);
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

  it("rejects a completely empty input", async () => {
    const res = await query(
      `mutation Update($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) { id }
      }`,
      { id: "1", input: {} },
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ updateUser: null });
    expect(res.body.errors[0].extensions.code).toBe("BAD_USER_INPUT");
  });

  it("rejects an invalid email without mutating the existing user", async () => {
    const res = await query(
      `mutation Update($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) { id }
      }`,
      { id: "1", input: { email: "not-an-email" } },
    );

    expect(res.status).toBe(200);
    expect(res.body.errors[0].extensions.code).toBe("BAD_USER_INPUT");

    const check = await query(`query { user(id: "1") { email } }`);
    expect(check.body.data.user.email).toBe("ada@example.com");
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
