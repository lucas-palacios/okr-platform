import { useMembers } from "@/hooks/useOkrs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: string | null | undefined;
  onChange: (memberId: string | null) => void;
  triggerClassName?: string;
}

const UNASSIGNED = "__none__";

export function MemberSelect({ value, onChange, triggerClassName }: Props) {
  const { data: members = [] } = useMembers();

  const selected = members.find((m) => m.id === value) ?? null;

  return (
    <Select
      value={value ?? UNASSIGNED}
      onValueChange={(v) => onChange(v === UNASSIGNED ? null : v)}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue>
          {selected ? (
            <span className="flex items-center gap-1.5">
              <Avatar initials={selected.avatarInitials} />
              <span className="truncate">{selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Sin asignar</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNASSIGNED}>
          <span className="text-muted-foreground">Sin asignar</span>
        </SelectItem>
        {members.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            <span className="flex items-center gap-2">
              <Avatar initials={m.avatarInitials} />
              <span>{m.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Small reusable avatar circle
export function Avatar({ initials, size = "sm" }: { initials: string; size?: "sm" | "xs" }) {
  const cls =
    size === "xs"
      ? "h-5 w-5 rounded-full bg-primary/15 text-primary text-[9px] font-semibold flex items-center justify-center shrink-0"
      : "h-6 w-6 rounded-full bg-primary/15 text-primary text-[10px] font-semibold flex items-center justify-center shrink-0";
  return <span className={cls}>{initials}</span>;
}
