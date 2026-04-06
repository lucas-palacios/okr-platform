import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateCheckIn } from "@/hooks/useOkrs";

interface Props {
  krId: string;
  currentValue: number | null;
  targetUnit: string | null;
}

export function KrCheckIn({ krId, currentValue, targetUnit }: Props) {
  const [value, setValue] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const createCheckIn = useCreateCheckIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === "") return;
    createCheckIn.mutate(
      {
        keyResultId: krId,
        date: new Date().toISOString().slice(0, 10),
        value: Number(value),
      },
      {
        onSuccess: () => {
          setValue("");
          setEditing(false);
        },
      }
    );
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline transition-colors"
      >
        Check in{currentValue !== null ? ` (current: ${currentValue}${targetUnit ? ` ${targetUnit}` : ""})` : ""}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <Input
        autoFocus
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={String(currentValue ?? 0)}
        className="h-7 w-24 text-xs"
      />
      {targetUnit && <span className="text-xs text-muted-foreground">{targetUnit}</span>}
      <Button type="submit" size="sm" className="h-7 text-xs px-2" disabled={createCheckIn.isPending}>
        {createCheckIn.isPending ? "…" : "Update"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 text-xs px-1"
        onClick={() => setEditing(false)}
      >
        ✕
      </Button>
    </form>
  );
}
