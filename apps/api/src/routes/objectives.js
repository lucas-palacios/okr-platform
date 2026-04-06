import { Hono } from "hono";
import { db } from "../db/client.js";
import { objectives, keyResults, teams, objectiveComments } from "../db/schema/index.js";
import { eq, asc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

const router = new Hono();

// GET /objectives?team=infra&quarter=Q2&year=2026
router.get("/", async (c) => {
  const { team, quarter, year } = c.req.query();

  let rows = await db
    .select({
      id: objectives.id,
      teamId: objectives.teamId,
      teamName: teams.name,
      code: objectives.code,
      title: objectives.title,
      focus: objectives.focus,
      quarter: objectives.quarter,
      year: objectives.year,
      status: objectives.status,
      owner: objectives.owner,
    })
    .from(objectives)
    .leftJoin(teams, eq(objectives.teamId, teams.id));

  if (team) rows = rows.filter((r) => r.teamId === team);
  if (quarter) rows = rows.filter((r) => r.quarter === quarter);
  if (year) rows = rows.filter((r) => r.year === Number(year));

  return c.json(rows);
});

// GET /objectives/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [obj] = await db
    .select({
      id: objectives.id,
      teamId: objectives.teamId,
      teamName: teams.name,
      code: objectives.code,
      title: objectives.title,
      focus: objectives.focus,
      quarter: objectives.quarter,
      year: objectives.year,
      status: objectives.status,
      owner: objectives.owner,
    })
    .from(objectives)
    .leftJoin(teams, eq(objectives.teamId, teams.id))
    .where(eq(objectives.id, id));

  if (!obj) return c.json({ error: "Objective not found" }, 404);
  return c.json(obj);
});

// GET /objectives/:id/key-results
router.get("/:id/key-results", async (c) => {
  const id = c.req.param("id");
  const rows = await db
    .select()
    .from(keyResults)
    .where(eq(keyResults.objectiveId, id));
  return c.json(rows);
});

// POST /objectives — create a new objective
router.post("/", async (c) => {
  const body = await c.req.json();
  const { teamId, title, focus, quarter, year, status, owner } = body;

  if (!teamId || !title || !quarter || !year) {
    return c.json({ error: "teamId, title, quarter, year are required" }, 400);
  }

  // Generate next code for this team
  const existing = await db
    .select({ code: objectives.code })
    .from(objectives)
    .where(eq(objectives.teamId, teamId));
  const nums = existing.map((r) => parseInt(r.code.replace(/\D/g, ""), 10)).filter((n) => !isNaN(n));
  const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
  const code = `O${nextNum}`;

  const id = uuidv4();
  await db.insert(objectives).values({
    id,
    teamId,
    code,
    title,
    focus: focus ?? null,
    quarter,
    year: Number(year),
    status: status ?? "active",
    owner: owner ?? null,
  });

  const [created] = await db
    .select({
      id: objectives.id,
      teamId: objectives.teamId,
      teamName: teams.name,
      code: objectives.code,
      title: objectives.title,
      focus: objectives.focus,
      quarter: objectives.quarter,
      year: objectives.year,
      status: objectives.status,
      owner: objectives.owner,
    })
    .from(objectives)
    .leftJoin(teams, eq(objectives.teamId, teams.id))
    .where(eq(objectives.id, id));

  return c.json(created, 201);
});

// PATCH /objectives/:id — update title, focus, status
router.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const allowed = ["title", "focus", "status", "quarter", "year", "owner"];
  const update = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );
  if (Object.keys(update).length === 0) {
    return c.json({ error: "No valid fields to update" }, 400);
  }
  await db.update(objectives).set(update).where(eq(objectives.id, id));
  const [updated] = await db
    .select({
      id: objectives.id,
      teamId: objectives.teamId,
      teamName: teams.name,
      code: objectives.code,
      title: objectives.title,
      focus: objectives.focus,
      quarter: objectives.quarter,
      year: objectives.year,
      status: objectives.status,
      owner: objectives.owner,
    })
    .from(objectives)
    .leftJoin(teams, eq(objectives.teamId, teams.id))
    .where(eq(objectives.id, id));
  if (!updated) return c.json({ error: "Objective not found" }, 404);
  return c.json(updated);
});

// DELETE /objectives/:id — delete objective and cascade KRs
router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [obj] = await db.select().from(objectives).where(eq(objectives.id, id));
  if (!obj) return c.json({ error: "Objective not found" }, 404);
  await db.delete(objectives).where(eq(objectives.id, id));
  return c.json({ deleted: id });
});

// ─── Comments ─────────────────────────────────────────────────────────────────

// GET /objectives/:id/comments
router.get("/:id/comments", async (c) => {
  const id = c.req.param("id");
  const [obj] = await db.select({ id: objectives.id }).from(objectives).where(eq(objectives.id, id));
  if (!obj) return c.json({ error: "Objective not found" }, 404);

  const rows = await db
    .select()
    .from(objectiveComments)
    .where(eq(objectiveComments.objectiveId, id))
    .orderBy(asc(objectiveComments.createdAt));

  return c.json(rows);
});

// POST /objectives/:id/comments
router.post("/:id/comments", async (c) => {
  const id = c.req.param("id");
  const [obj] = await db.select({ id: objectives.id }).from(objectives).where(eq(objectives.id, id));
  if (!obj) return c.json({ error: "Objective not found" }, 404);

  const body = await c.req.json();
  const { author, body: commentBody } = body;

  if (!author || !commentBody) {
    return c.json({ error: "author and body are required" }, 400);
  }

  const commentId = uuidv4();
  const createdAt = new Date().toISOString();

  await db.insert(objectiveComments).values({
    id: commentId,
    objectiveId: id,
    author: String(author).trim(),
    body: String(commentBody).trim(),
    createdAt,
  });

  const [created] = await db
    .select()
    .from(objectiveComments)
    .where(eq(objectiveComments.id, commentId));

  return c.json(created, 201);
});

// DELETE /objectives/:id/comments/:commentId
router.delete("/:id/comments/:commentId", async (c) => {
  const commentId = c.req.param("commentId");
  const [comment] = await db
    .select()
    .from(objectiveComments)
    .where(eq(objectiveComments.id, commentId));

  if (!comment) return c.json({ error: "Comment not found" }, 404);
  await db.delete(objectiveComments).where(eq(objectiveComments.id, commentId));
  return c.json({ deleted: commentId });
});

export default router;
