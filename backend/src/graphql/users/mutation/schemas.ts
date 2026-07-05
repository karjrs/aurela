import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.email("Invalid email address"),
});

// `name`/`email` stay `.optional()` rather than `.nullable()`: `User.name` and
// `User.email` are non-null in the GraphQL SDL, so an explicit `null` isn't a
// valid partial-update value — omitting the field is the only way to "not change" it.
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.email("Invalid email address").optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "At least one of name or email must be provided",
  });
