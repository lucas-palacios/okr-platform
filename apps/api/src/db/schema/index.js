import { pgTable, text, real, integer, serial, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Members ──────────────────────────────────────────────────────────────────
export const members = pgTable("members", {
  id: text("id").primaryKey(), // uuid
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  area: text("area").notNull(), // "infra" | "cs" | "all"
  avatarInitials: text("avatar_initials").notNull(),
});

// ─── Teams ────────────────────────────────────────────────────────────────────
export const teams = pgTable("teams", {
  id: text("id").primaryKey(), // slug: "infra", "cs"
  name: text("name").notNull(),
  description: text("description"),
});

// ─── Objectives ───────────────────────────────────────────────────────────────
export const objectives = pgTable("objectives", {
  id: text("id").primaryKey(), // uuid
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // "O1", "O2", ...
  title: text("title").notNull(),
  focus: text("focus"), // the "Foco" / context paragraph
  quarter: text("quarter").notNull(), // "Q2"
  year: integer("year").notNull(), // 2026
  status: text("status").notNull().default("active"), // active | achieved | at-risk | missed
  owner: text("owner"), // member id (uuid) or null
});

// ─── Key Results ──────────────────────────────────────────────────────────────
export const keyResults = pgTable("key_results", {
  id: text("id").primaryKey(), // uuid
  objectiveId: text("objective_id")
    .notNull()
    .references(() => objectives.id, { onDelete: "cascade" }),
  code: text("code").notNull(), // "KR 1.1", "KR 2.3", ...
  title: text("title").notNull(),
  category: text("category"), // Automatización, Velocidad, Hito, SLO, IA, Diseño, ...
  targetValue: real("target_value"), // numeric target (e.g. 100, 15, 50)
  targetUnit: text("target_unit"), // "%", "min", "hours", "steps"
  currentValue: real("current_value").default(0),
  baselineValue: real("baseline_value"), // starting point for "lower is better" KRs
  targetText: text("target_text"), // full human-readable target for qualitative KRs
  status: text("status").notNull().default("on-track"), // on-track | at-risk | achieved | missed | not-started
  owner: text("owner"), // team slug or person name
  dueDate: text("due_date"), // ISO date
  notes: text("notes"),
});

// ─── Check-ins ────────────────────────────────────────────────────────────────
export const checkIns = pgTable("check_ins", {
  id: text("id").primaryKey(), // uuid
  keyResultId: text("key_result_id")
    .notNull()
    .references(() => keyResults.id, { onDelete: "cascade" }),
  date: text("date").notNull(), // ISO date
  value: real("value"), // the new current value at this check-in
  note: text("note"),
  createdBy: text("created_by"),
});

// ─── Objective Comments ───────────────────────────────────────────────────────
export const objectiveComments = pgTable("objective_comments", {
  id: text("id").primaryKey(), // uuid
  objectiveId: text("objective_id")
    .notNull()
    .references(() => objectives.id, { onDelete: "cascade" }),
  author: text("author").notNull(),
  body: text("body").notNull(),
  createdAt: text("created_at").notNull(), // ISO timestamp
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const teamsRelations = relations(teams, ({ many }) => ({
  objectives: many(objectives),
}));

export const objectivesRelations = relations(objectives, ({ one, many }) => ({
  team: one(teams, { fields: [objectives.teamId], references: [teams.id] }),
  keyResults: many(keyResults),
  comments: many(objectiveComments),
}));

export const objectiveCommentsRelations = relations(objectiveComments, ({ one }) => ({
  objective: one(objectives, {
    fields: [objectiveComments.objectiveId],
    references: [objectives.id],
  }),
}));

export const keyResultsRelations = relations(keyResults, ({ one, many }) => ({
  objective: one(objectives, {
    fields: [keyResults.objectiveId],
    references: [objectives.id],
  }),
  checkIns: many(checkIns),
}));

export const checkInsRelations = relations(checkIns, ({ one }) => ({
  keyResult: one(keyResults, {
    fields: [checkIns.keyResultId],
    references: [keyResults.id],
  }),
}));
