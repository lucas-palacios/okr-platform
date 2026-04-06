import { Hono } from "hono";
import { db } from "../db/client.js";
import { teams, objectives } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

const router = new Hono();

// GET /teams
router.get("/", async (c) => {
  const rows = await db.select().from(teams);
  return c.json(rows);
});

// GET /teams/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [team] = await db.select().from(teams).where(eq(teams.id, id));
  if (!team) return c.json({ error: "Team not found" }, 404);
  return c.json(team);
});

// GET /teams/:id/objectives
router.get("/:id/objectives", async (c) => {
  const id = c.req.param("id");
  const rows = await db
    .select()
    .from(objectives)
    .where(eq(objectives.teamId, id));
  return c.json(rows);
});

export default router;
