import { z } from "zod";

// The `id` column is a Postgres uuid — a malformed id would otherwise throw a
// driver-level "invalid input syntax for type uuid" error instead of the
// "not found" result these resolvers are meant to return.
export const isValidId = (id: string) => z.uuid().safeParse(id).success;
