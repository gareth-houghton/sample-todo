import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { todos } from "./schema";

if(!process.env.PGDB_URL) {
  throw new Error("Database connection string (PGDB_URL) is not defined");
}

const client = new Client({
  connectionString: process.env.PGDB_URL,
});

export const db = drizzle(client, { schema: { todos } });