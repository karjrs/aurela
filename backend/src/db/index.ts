import { drizzle } from "drizzle-orm/node-postgres";

const url = process.env.DATABASE_URL as string;

export const db = drizzle(url);
