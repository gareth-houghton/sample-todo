import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle(process.env.PGDB_URL!);