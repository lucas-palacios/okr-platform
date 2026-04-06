import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateKeyResult } from "@/hooks/useOkrs";
import { cn, KR_STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/lib/utils";

interface Props {
  krId: string;
  status: string;
}

export function KrStatusSelect({ krId, status }: Props) {
  const updateKr = useUpdateKeyResult();

  const handleChange = (newStatus: string) => {
    if (newStatus === status) return;
    updateKr.mutate({ id: krId, status: newStatus });
  };

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "h-6 text-xs px-2 py-0 rounded-full border-0 w-auto min-w-[90px] font-medium",
          STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {KR_STATUSES.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {STATUS_LABELS[s] ?? s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
