import { Hono } from "hono";
import { db } from "../db/client.js";
import { objectives } from "../db/schema/index.js";
import { sql } from "drizzle-orm";

const router = new Hono();

// GET /quarters — returns all distinct quarters found in objectives, with count
router.get("/", async (c) => {
  const rows = await db
    .select({
      quarter: objectives.quarter,
      year: objectives.year,
      objectiveCount: sql`count(*)`.mapWith(Number),
    })
    .from(objectives)
    .groupBy(objectives.quarter, objectives.year)
    .orderBy(sql`year DESC, quarter DESC`);

  return c.json(rows);
});

export default router;
