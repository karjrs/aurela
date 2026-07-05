import { createGraphQLError } from "graphql-yoga";
import { z } from "zod";
import { EMAIL_ALREADY_IN_USE } from "../../consts/errors/index.js";

export const isValidId = (id: string) => z.uuid().safeParse(id).success;

export const validationError = (error: z.ZodError) =>
  createGraphQLError("Invalid input", {
    extensions: {
      code: "BAD_USER_INPUT",
      fieldErrors: z.flattenError(error).fieldErrors,
    },
  });

export const emailConflictError = () =>
  createGraphQLError("Email already in use", {
    extensions: {
      code: "EMAIL_ALREADY_IN_USE",
      fieldErrors: { email: [EMAIL_ALREADY_IN_USE] },
    },
  });
