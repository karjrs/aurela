import { eq } from "drizzle-orm";
import { createGraphQLError } from "graphql-yoga";
import { z } from "zod";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import type { MutationResolvers } from "../../types.js";
import { isValidId } from "../is-valid-id.js";
import { createUserSchema, updateUserSchema } from "./schemas.js";

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

export const mutation: MutationResolvers = {
  createUser: async (_parent, args) => {
    const result = createUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);

    const [user] = await db.insert(usersTable).values(result.data).returning();
    return user;
  },
  updateUser: async (_parent, args) => {
    const result = updateUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);
    if (!isValidId(args.id)) return null;

    const [user] = await db
      .update(usersTable)
      .set(result.data)
      .where(eq(usersTable.id, args.id))
      .returning();
    return user ?? null;
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
