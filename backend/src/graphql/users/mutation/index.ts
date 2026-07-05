import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import { isUniqueViolation } from "../../../utils/helpers/isUniqueViolation/index.js";
import {
  emailConflictError,
  isValidId,
  validationError,
} from "../../../utils/helpers/validators/index.js";
import type { MutationResolvers } from "../../types.js";
import { createUserSchema, updateUserSchema } from "./schemas.js";

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
