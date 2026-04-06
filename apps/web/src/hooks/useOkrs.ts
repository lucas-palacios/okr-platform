import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Objective, KeyResult } from "@/lib/api";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useMembers = () =>
  useQuery({ queryKey: ["members"], queryFn: api.members.list });

export const useQuarters = () =>
  useQuery({ queryKey: ["quarters"], queryFn: api.quarters.list });

export const useTeams = () =>
  useQuery({ queryKey: ["teams"], queryFn: api.teams.list });

export const useObjectives = (params?: { team?: string; quarter?: string; year?: number }) =>
  useQuery({
    queryKey: ["objectives", params],
    queryFn: () => api.objectives.list(params),
  });

export const useObjective = (id: string) =>
  useQuery({
    queryKey: ["objectives", id],
    queryFn: () => api.objectives.get(id),
    enabled: !!id,
  });

export const useKeyResults = (params?: { objective?: string; status?: string; owner?: string }) =>
  useQuery({
    queryKey: ["key-results", params],
    queryFn: () => api.keyResults.list(params),
  });

export const useKeyResultsByObjective = (objectiveId: string) =>
  useQuery({
    queryKey: ["key-results", "objective", objectiveId],
    queryFn: () => api.objectives.keyResults(objectiveId),
    enabled: !!objectiveId,
  });

export const useCheckIns = (keyResultId: string) =>
  useQuery({
    queryKey: ["check-ins", keyResultId],
    queryFn: () => api.checkIns.list(keyResultId),
    enabled: !!keyResultId,
  });

// ─── Objective mutations ──────────────────────────────────────────────────────

export const useCreateObjective = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof api.objectives.create>[0]) =>
      api.objectives.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["objectives"] });
    },
  });
};

export const useUpdateObjective = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Pick<Objective, "title" | "focus" | "status" | "quarter" | "year" | "owner">>) =>
      api.objectives.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["objectives"] });
      qc.invalidateQueries({ queryKey: ["objectives", vars.id] });
    },
  });
};

export const useDeleteObjective = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.objectives.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["objectives"] });
      qc.invalidateQueries({ queryKey: ["key-results"] });
    },
  });
};

// ─── Key Result mutations ─────────────────────────────────────────────────────

export const useCreateKeyResult = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof api.keyResults.create>[0]) =>
      api.keyResults.create(body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["key-results"] });
      qc.invalidateQueries({ queryKey: ["key-results", "objective", data.objectiveId] });
    },
  });
};

export const useUpdateKeyResult = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & Partial<Omit<KeyResult, "id" | "objectiveId" | "code">>) =>
      api.keyResults.update(id, body),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["key-results"] });
      qc.invalidateQueries({ queryKey: ["key-results", "objective", data.objectiveId] });
    },
  });
};

export const useDeleteKeyResult = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.keyResults.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["key-results"] });
    },
  });
};

// ─── Check-in mutations ───────────────────────────────────────────────────────

export const useCreateCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.checkIns.create,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["check-ins", data.keyResultId] });
      qc.invalidateQueries({ queryKey: ["key-results"] });
    },
  });
};

// ─── Objective comments ───────────────────────────────────────────────────────

export const useObjectiveComments = (objectiveId: string) =>
  useQuery({
    queryKey: ["objective-comments", objectiveId],
    queryFn: () => api.objectives.comments.list(objectiveId),
    enabled: !!objectiveId,
  });

export const useCreateObjectiveComment = (objectiveId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { author: string; body: string }) =>
      api.objectives.comments.create(objectiveId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["objective-comments", objectiveId] });
    },
  });
};

export const useDeleteObjectiveComment = (objectiveId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      api.objectives.comments.delete(objectiveId, commentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["objective-comments", objectiveId] });
    },
  });
};
