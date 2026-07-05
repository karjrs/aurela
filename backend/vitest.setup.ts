import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { vi } from "vitest";
import { seedUsers } from "./src/db/fixtures.js";
import { usersTable } from "./src/db/schema.js";

const client = new PGlite();
const db = drizzle(client);

await migrate(db, {
  migrationsFolder: fileURLToPath(new URL("./drizzle", import.meta.url)),
});

await db.insert(usersTable).values(seedUsers);

vi.mock("./src/db/index.js", () => ({ db }));
