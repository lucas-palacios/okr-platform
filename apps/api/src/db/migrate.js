import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, client } from "./client.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsFolder = join(__dirname, "migrations");

console.log("Running migrations...");
await migrate(db, { migrationsFolder });
console.log("Migrations complete.");
await client.end();
