import { Hono } from "hono";
import { db } from "../db/client.js";
import { members } from "../db/schema/index.js";

const router = new Hono();

// GET /members — list all members
router.get("/", async (c) => {
  const rows = await db.select().from(members);
  return c.json(rows);
});

export default router;
