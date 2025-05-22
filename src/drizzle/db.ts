import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { todos } from "./schema";

if(!process.env.PGDB_URL) {
  throw new Error("Database connection string (PGDB_URL) is not defined");
}

const client = new Client({
  connectionString: process.env.PGDB_URL,
});
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { todos } from "./schema";

if (!process.env.PGDB_URL) {
  throw new Error("Database connection string (PGDB_URL) is not defined");
}

const client = new Client({
  connectionString: process.env.PGDB_URL,
});

// Connect to the database with error handling
client.connect()
  .catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1); // Exit the process on connection failure
  });

export const db = drizzle(client, { schema: { todos } });