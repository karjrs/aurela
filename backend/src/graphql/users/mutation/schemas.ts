import {
  AT_LEAST_ONE_FIELD_REQUIRED,
  INVALID_EMAIL,
  NAME_REQUIRED,
} from "@utils/consts/errors/index.js";
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(1, NAME_REQUIRED),
  email: z.email(INVALID_EMAIL),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, NAME_REQUIRED).optional(),
    email: z.email(INVALID_EMAIL).optional(),
  })
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
