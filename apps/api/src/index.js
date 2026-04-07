import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { sql } from "drizzle-orm";
import { db, client } from "./db/client.js";
import { teams } from "./db/schema/index.js";
import { seedDatabase } from "./db/seed.js";
import teamsRouter from "./routes/teams.js";
import objectivesRouter from "./routes/objectives.js";
import keyResultsRouter from "./routes/keyResults.js";
import checkInsRouter from "./routes/checkIns.js";
import quartersRouter from "./routes/quarters.js";
import membersRouter from "./routes/members.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";

// ─── Startup: migrate + seed ──────────────────────────────────────────────────
async function runStartupTasks() {
  const migrationsFolder = join(__dirname, "db/migrations");

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder });
  console.log("Migrations complete.");

  // Auto-seed only if DB is empty
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(teams);
  if (Number(count) === 0) {
    console.log("Empty database detected — running seed...");
    await seedDatabase(db);
  } else {
    console.log(`Database has data (${count} teams) — skipping seed.`);
  }
}

const app = new Hono();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use("*", logger());

if (!isProd) {
  app.use(
    "*",
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  );
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.route("/api/quarters", quartersRouter);
app.route("/api/teams", teamsRouter);
app.route("/api/objectives", objectivesRouter);
app.route("/api/key-results", keyResultsRouter);
app.route("/api/check-ins", checkInsRouter);
app.route("/api/members", membersRouter);

// ─── Health ───────────────────────────────────────────────────────────────────
app.get("/api/health", (c) => c.json({ status: "ok", ts: new Date().toISOString() }));

// ─── Serve frontend statics in production ────────────────────────────────────
if (isProd) {
  // __dirname = .../apps/api/src — web dist is always 3 levels up + apps/web/dist
  const webDistAbsolute = join(__dirname, "../../../apps/web/dist");
  // serveStatic root must be relative to process.cwd(), so compute it dynamically
  const serveRoot = relative(process.cwd(), webDistAbsolute);

  app.use(
    "/*",
    serveStatic({
      root: serveRoot,
    })
  );

  // SPA fallback: serve index.html for any unmatched route
  app.notFound((c) => {
    try {
      const html = readFileSync(join(webDistAbsolute, "index.html"), "utf-8");
      return c.html(html, 200);
    } catch (e) {
      console.error("Frontend dist not found:", e.message);
      return c.text("Frontend not built. Run: npm run build", 503);
    }
  });
} else {
  app.notFound((c) => c.json({ error: "Not found" }, 404));
}

// ─── Server ───────────────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT ?? 3001);

await runStartupTasks();

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`OKR Platform API running on http://localhost:${PORT}`);
  if (isProd) {
    console.log("Serving frontend from apps/web/dist/");
  }
});
