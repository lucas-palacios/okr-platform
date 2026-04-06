import { cn, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

interface Props {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600",
        className
      )}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
