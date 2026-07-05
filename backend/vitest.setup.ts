import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { vi } from "vitest";
import { usersTable } from "./src/db/schema.js";

const client = new PGlite();
const db = drizzle(client);

await migrate(db, {
  migrationsFolder: fileURLToPath(new URL("./drizzle", import.meta.url)),
});

await db.insert(usersTable).values([
  { name: "Ada Lovelace", email: "ada@example.com" },
  { name: "Alan Turing", email: "alan@example.com" },
]);

vi.mock("./src/db/index.js", () => ({ db }));
