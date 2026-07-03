import { randomUUID } from "node:crypto";
import { createGraphQLError } from "graphql-yoga";
import { z } from "zod";
import type { MutationResolvers } from "../../types.js";
import { users } from "../consts.js";
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
  createUser: (_parent, args) => {
    const result = createUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);

    const user = { id: randomUUID(), ...result.data };
    users.push(user);
    return user;
  },
  updateUser: (_parent, args) => {
    const result = updateUserSchema.safeParse(args.input);
    if (!result.success) throw validationError(result.error);

    const user = users.find((u) => u.id === args.id);
    if (!user) return null;
    Object.assign(user, result.data);
    return user;
  },
  deleteUser: (_parent, args) => {
    const index = users.findIndex((u) => u.id === args.id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};
