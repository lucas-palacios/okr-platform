const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: PATCH ${path}`);
  return res.json() as Promise<T>;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: POST ${path}`);
  return res.json() as Promise<T>;
}

async function del<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`API error ${res.status}: DELETE ${path}`);
  return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface QuarterSummary {
  quarter: string;
  year: number;
  objectiveCount: number;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
}

export interface Objective {
  id: string;
  teamId: string;
  teamName: string | null;
  code: string;
  title: string;
  focus: string | null;
  quarter: string;
  year: number;
  status: string;
  owner: string | null;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  code: string;
  title: string;
  category: string | null;
  targetValue: number | null;
  targetUnit: string | null;
  currentValue: number | null;
  targetText: string | null;
  status: string;
  owner: string | null;
  dueDate: string | null;
  notes: string | null;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  area: string;
  avatarInitials: string;
}

export interface CheckIn {
  id: string;
  keyResultId: string;
  date: string;
  value: number | null;
  note: string | null;
  createdBy: string | null;
}

export interface ObjectiveComment {
  id: string;
  objectiveId: string;
  author: string;
  body: string;
  createdAt: string;
}

// ─── API calls ────────────────────────────────────────────────────────────────
export const api = {
  quarters: {
    list: () => get<QuarterSummary[]>("/quarters"),
  },
  teams: {
    list: () => get<Team[]>("/teams"),
    get: (id: string) => get<Team>(`/teams/${id}`),
    objectives: (id: string) => get<Objective[]>(`/teams/${id}/objectives`),
  },
  objectives: {
    list: (params?: { team?: string; quarter?: string; year?: number }) => {
      const qs = new URLSearchParams();
      if (params?.team) qs.set("team", params.team);
      if (params?.quarter) qs.set("quarter", params.quarter);
      if (params?.year) qs.set("year", String(params.year));
      const q = qs.toString();
      return get<Objective[]>(`/objectives${q ? `?${q}` : ""}`);
    },
    get: (id: string) => get<Objective>(`/objectives/${id}`),
    keyResults: (id: string) => get<KeyResult[]>(`/objectives/${id}/key-results`),
    create: (body: { teamId: string; title: string; focus?: string; quarter: string; year: number; status?: string; owner?: string }) =>
      post<Objective>("/objectives", body),
    update: (id: string, body: Partial<Pick<Objective, "title" | "focus" | "status" | "quarter" | "year" | "owner">>) =>
      patch<Objective>(`/objectives/${id}`, body),
    delete: (id: string) => del<{ deleted: string }>(`/objectives/${id}`),
    comments: {
      list: (objectiveId: string) => get<ObjectiveComment[]>(`/objectives/${objectiveId}/comments`),
      create: (objectiveId: string, body: { author: string; body: string }) =>
        post<ObjectiveComment>(`/objectives/${objectiveId}/comments`, body),
      delete: (objectiveId: string, commentId: string) =>
        del<{ deleted: string }>(`/objectives/${objectiveId}/comments/${commentId}`),
    },
  },
  keyResults: {
    list: (params?: { objective?: string; status?: string; owner?: string }) => {
      const qs = new URLSearchParams();
      if (params?.objective) qs.set("objective", params.objective);
      if (params?.status) qs.set("status", params.status);
      if (params?.owner) qs.set("owner", params.owner);
      const q = qs.toString();
      return get<KeyResult[]>(`/key-results${q ? `?${q}` : ""}`);
    },
    get: (id: string) => get<KeyResult>(`/key-results/${id}`),
    create: (body: {
      objectiveId: string;
      title: string;
      category?: string;
      targetValue?: number;
      targetUnit?: string;
      targetText?: string;
      status?: string;
      owner?: string;
      dueDate?: string;
      notes?: string;
    }) => post<KeyResult>("/key-results", body),
    update: (id: string, body: Partial<Omit<KeyResult, "id" | "objectiveId" | "code">>) =>
      patch<KeyResult>(`/key-results/${id}`, body),
    delete: (id: string) => del<{ deleted: string }>(`/key-results/${id}`),
    checkIns: (id: string) => get<CheckIn[]>(`/key-results/${id}/check-ins`),
  },
  members: {
    list: () => get<Member[]>("/members"),
  },
  checkIns: {
    list: (keyResultId?: string) => {
      const qs = keyResultId ? `?key_result=${keyResultId}` : "";
      return get<CheckIn[]>(`/check-ins${qs}`);
    },
    create: (body: { keyResultId: string; date: string; value?: number; note?: string; createdBy?: string }) =>
      post<CheckIn>("/check-ins", body),
  },
};
