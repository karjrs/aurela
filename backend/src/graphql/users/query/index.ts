import { eq } from "drizzle-orm";
import { db } from "../../../db/index.js";
import { usersTable } from "../../../db/schema.js";
import type { QueryResolvers } from "../../types.js";
import { isValidId } from "../is-valid-id.js";

export const query: QueryResolvers = {
  user: async (_parent, args) => {
    if (!isValidId(args.id)) return null;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, args.id));
    return user ?? null;
  },
  users: () => db.select().from(usersTable),
};
