import { db } from "./index.js";
import { usersTable } from "./schema.js";

await db.insert(usersTable).values([
  { name: "Ada Lovelace", email: "ada@example.com" },
  { name: "Alan Turing", email: "alan@example.com" },
]);
