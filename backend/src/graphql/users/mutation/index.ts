import { eq } from "drizzle-orm";
import { createGraphQLError } from "graphql-yoga";
import { z } from "zod";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import type { MutationResolvers } from "../../types.js";
import { isValidId } from "../is-valid-id.js";
import {
  createUserSchema,
  EMAIL_ALREADY_IN_USE,
  updateUserSchema,
} from "./schemas.js";

// Must use graphql-yoga's createGraphQLError, not `new GraphQLError` from
// "graphql" directly — Yoga's error masking checks `instanceof GraphQLError`
// against its own (CJS) copy of graphql-js, which fails for an ESM-imported
// GraphQLError and gets the error masked into a generic "Unexpected error."
const validationError = (error: z.ZodError) =>
  createGraphQLError("Invalid input", {
    extensions: {
      code: "BAD_USER_INPUT",
      fieldErrors: z.flattenError(error).fieldErrors,
    },
  });

const emailConflictError = () =>
  createGraphQLError("Email already in use", {
    extensions: {
      code: "EMAIL_ALREADY_IN_USE",
      fieldErrors: { email: [EMAIL_ALREADY_IN_USE] },
    },
  });

const hasCode = (value: unknown): value is { code: unknown } =>
  typeof value === "object" && value !== null && "code" in value;

// Postgres's unique_violation SQLSTATE — thrown by the driver when the
// `email` column's unique constraint rejects an insert/update. Drizzle wraps
// every query error in its own DrizzleQueryError, with the real driver error
// on `.cause` — the SQLSTATE code lives there, not on the wrapper itself.
const isUniqueViolation = (error: unknown) => {
  const cause = error instanceof Error ? error.cause : undefined;
  return (
    (hasCode(error) && error.code === "23505") ||
    (hasCode(cause) && cause.code === "23505")
  );
};

export const mutation: MutationResolvers = {
  createUser: async (_parent, args) => {
    const result = createUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);

    try {
      const [user] = await db
        .insert(usersTable)
        .values(result.data)
        .returning();
      return user;
    } catch (error) {
      if (isUniqueViolation(error)) throw emailConflictError();
      throw error;
    }
  },
  updateUser: async (_parent, args) => {
    const result = updateUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);
    if (!isValidId(args.id)) return null;

    try {
      const [user] = await db
        .update(usersTable)
        .set(result.data)
        .where(eq(usersTable.id, args.id))
        .returning();
      return user ?? null;
    } catch (error) {
      if (isUniqueViolation(error)) throw emailConflictError();
      throw error;
    }
  },
  deleteUser: async (_parent, args) => {
    if (!isValidId(args.id)) return false;

    const [deleted] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, args.id))
      .returning();
    return !!deleted;
  },
};
