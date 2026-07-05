import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { app } from "./app.js";
import { db } from "./db/index.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const port = process.env.PORT ?? 4000;

// Unhandled 'error' events on the underlying pg.Pool crash the process by
// default — log instead so a dropped idle connection doesn't take down the server.
db.$client.on("error", (error) => {
  console.error("Unexpected database pool error", error);
});

await migrate(db, {
  migrationsFolder: fileURLToPath(new URL("../drizzle", import.meta.url)),
});

const server = app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    server.close(() => {
      db.$client.end().finally(() => process.exit(0));
    });
  });
}
