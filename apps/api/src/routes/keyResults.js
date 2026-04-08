import { Hono } from "hono";
import { db } from "../db/client.js";
import { keyResults, checkIns, objectives } from "../db/schema/index.js";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = new Hono();

// GET /key-results?objective=<id>&status=on-track&owner=infra
router.get("/", async (c) => {
  const { objective, status, owner } = c.req.query();

  let rows = await db.select().from(keyResults).orderBy(asc(keyResults.code));

  if (objective) rows = rows.filter((r) => r.objectiveId === objective);
  if (status) rows = rows.filter((r) => r.status === status);
  if (owner) rows = rows.filter((r) => r.owner === owner);

  return c.json(rows);
});

// GET /key-results/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [kr] = await db.select().from(keyResults).where(eq(keyResults.id, id));
  if (!kr) return c.json({ error: "Key Result not found" }, 404);
  return c.json(kr);
});

// GET /key-results/:id/check-ins
router.get("/:id/check-ins", async (c) => {
  const id = c.req.param("id");
  const rows = await db
    .select()
    .from(checkIns)
    .where(eq(checkIns.keyResultId, id));
  return c.json(rows);
});

// POST /key-results — create a new KR linked to an objective
router.post("/", async (c) => {
  const body = await c.req.json();
  const { objectiveId, title, category, targetValue, targetUnit, targetText, status, owner, dueDate, notes, baselineValue } = body;

  if (!objectiveId || !title) {
    return c.json({ error: "objectiveId and title are required" }, 400);
  }

  const [obj] = await db.select().from(objectives).where(eq(objectives.id, objectiveId));
  if (!obj) return c.json({ error: "Objective not found" }, 404);

  // Generate next code for this objective (e.g. KR 1.1, KR 1.2, ...)
  const existing = await db
    .select({ code: keyResults.code })
    .from(keyResults)
    .where(eq(keyResults.objectiveId, objectiveId));
  const objNum = obj.code.replace(/\D/g, "");
  const nums = existing
    .map((r) => {
      const parts = r.code.split(".");
      return parts.length > 1 ? parseInt(parts[parts.length - 1], 10) : 0;
    })
    .filter((n) => !isNaN(n) && n > 0);
  const nextKrNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  const code = `KR ${objNum}.${nextKrNum}`;

  const id = uuidv4();
  await db.insert(keyResults).values({
    id,
    objectiveId,
    code,
    title,
    category: category ?? null,
    targetValue: targetValue !== undefined ? Number(targetValue) : null,
    targetUnit: targetUnit ?? null,
    currentValue: baselineValue !== undefined ? Number(baselineValue) : 0,
    baselineValue: baselineValue !== undefined ? Number(baselineValue) : null,
    targetText: targetText ?? null,
    status: status ?? "not-started",
    owner: owner ?? null,
    dueDate: dueDate ?? null,
    notes: notes ?? null,
  });

  const [created] = await db.select().from(keyResults).where(eq(keyResults.id, id));
  return c.json(created, 201);
});

// PATCH /key-results/:id — update any field
router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const allowed = [
    "title", "category", "targetValue", "targetUnit", "currentValue",
    "targetText", "status", "owner", "dueDate", "notes", "baselineValue",
  ];
  const update = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );
  if (Object.keys(update).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }
  await db.update(keyResults).set(update).where(eq(keyResults.id, id));
  const [updated] = await db
    .select()
    .from(keyResults)
    .where(eq(keyResults.id, id));
  if (!updated) return c.json({ error: "Key Result not found" }, 404);
  return c.json(updated);
});

// DELETE /key-results/:id — delete KR and cascade check-ins
router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [kr] = await db.select().from(keyResults).where(eq(keyResults.id, id));
  if (!kr) return c.json({ error: "Key Result not found" }, 404);
  await db.delete(keyResults).where(eq(keyResults.id, id));
  return c.json({ deleted: id });
});

export default router;
