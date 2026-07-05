import { z } from "zod";

export const NAME_REQUIRED = "nameRequired";
export const INVALID_EMAIL = "invalidEmail";
export const AT_LEAST_ONE_FIELD_REQUIRED = "atLeastOneFieldRequired";
export const EMAIL_ALREADY_IN_USE = "emailAlreadyInUse";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, NAME_REQUIRED),
  email: z.email(INVALID_EMAIL),
});

// `name`/`email` stay `.optional()` rather than `.nullable()`: `User.name` and
// `User.email` are non-null in the GraphQL SDL, so an explicit `null` isn't a
// valid partial-update value — omitting the field is the only way to "not change" it.
export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, NAME_REQUIRED).optional(),
    email: z.email(INVALID_EMAIL).optional(),
  })
  // superRefine + addIssue on both paths (rather than a plain .refine(), which
  // has no field path) so this lands in fieldErrors for both fields — a plain
  // .refine()'s message has no path and z.flattenError() drops it into
  // formErrors, which nothing downstream ever reads.
  .superRefine((data, ctx) => {
    if (data.name !== undefined || data.email !== undefined) return;
    ctx.addIssue({
      code: "custom",
      message: AT_LEAST_ONE_FIELD_REQUIRED,
      path: ["name"],
    });
    ctx.addIssue({
      code: "custom",
      message: AT_LEAST_ONE_FIELD_REQUIRED,
      path: ["email"],
    });
  });
