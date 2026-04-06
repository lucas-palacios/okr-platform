import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function progressPercent(
  current: number | null,
  target: number | null
): number {
  if (current === null || target === null || target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export const STATUS_LABELS: Record<string, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  achieved: "Achieved",
  missed: "Missed",
  "not-started": "Not started",
  "in-progress": "In progress",
  completed: "Completed",
  blocked: "Blocked",
  active: "Active",
};

export const STATUS_COLORS: Record<string, string> = {
  "on-track": "status-on-track",
  "at-risk": "status-at-risk",
  achieved: "status-achieved",
  missed: "status-missed",
  "not-started": "status-not-started",
  "in-progress": "status-on-track",
  completed: "status-achieved",
  blocked: "bg-red-100 text-red-700",
  active: "status-active",
};

export const KR_STATUSES = [
  "not-started",
  "in-progress",
  "on-track",
  "at-risk",
  "completed",
  "blocked",
] as const;

export const OBJECTIVE_STATUSES = [
  "active",
  "at-risk",
  "achieved",
  "missed",
] as const;
