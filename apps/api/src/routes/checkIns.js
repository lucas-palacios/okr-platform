import { Hono } from "hono";
import { db } from "../db/client.js";
import { checkIns, keyResults } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = new Hono();

// GET /check-ins?key_result=<id>
router.get("/", async (c) => {
  const { key_result } = c.req.query();
  let rows = await db
    .select()
    .from(checkIns)
    .orderBy(desc(checkIns.date));

  if (key_result) rows = rows.filter((r) => r.keyResultId === key_result);
  return c.json(rows);
});

// GET /check-ins/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [ci] = await db.select().from(checkIns).where(eq(checkIns.id, id));
  if (!ci) return c.json({ error: "Check-in not found" }, 404);
  return c.json(ci);
});

// POST /check-ins — create a new check-in and update KR current value
router.post("/", async (c) => {
  const body = await c.req.json();
  const { keyResultId, date, value, note, createdBy } = body;

  if (!keyResultId || !date) {
    return c.json({ error: "keyResultId and date are required" }, 400);
  }

  const [kr] = await db
    .select()
    .from(keyResults)
    .where(eq(keyResults.id, keyResultId));
  if (!kr) return c.json({ error: "Key Result not found" }, 404);

  const id = uuidv4();
  await db.insert(checkIns).values({
    id,
    keyResultId,
    date,
    value: value ?? null,
    note: note ?? null,
    createdBy: createdBy ?? null,
  });

  // Update KR's currentValue with the latest check-in value
  if (value !== undefined && value !== null) {
    await db
      .update(keyResults)
      .set({ currentValue: value })
      .where(eq(keyResults.id, keyResultId));
  }

  const [created] = await db
    .select()
    .from(checkIns)
    .where(eq(checkIns.id, id));
  return c.json(created, 201);
});

export default router;
