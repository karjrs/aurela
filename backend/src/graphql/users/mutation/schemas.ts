import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

// name/email stay non-nullable here even though `UpdateUserInput` allows an
// explicit `null` per field — User.name/email are non-null in the schema, so
// clearing a field isn't a valid partial update.
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.email("Invalid email address").optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one of name or email must be provided",
  });
