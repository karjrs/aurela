import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import type { QueryResolvers } from "../../types.js";

export const query: QueryResolvers = {
  user: async (_parent, args) => {
    // The `id` column is a Postgres uuid — a malformed id would otherwise
    // throw a driver-level "invalid input syntax for type uuid" error
    // instead of the "not found" null this resolver is meant to return.
    if (!z.uuid().safeParse(args.id).success) return null;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, args.id));
    return user ?? null;
  },
  users: () => db.select().from(usersTable),
};
