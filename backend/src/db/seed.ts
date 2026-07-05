import { seedUsers } from "./fixtures.js";
import { db } from "./index.js";
import { usersTable } from "./schema.js";

await db
  .insert(usersTable)
  .values(seedUsers)
  .onConflictDoNothing({ target: usersTable.email });
