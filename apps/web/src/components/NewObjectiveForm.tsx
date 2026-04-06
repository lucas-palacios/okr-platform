import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MemberSelect } from "@/components/MemberSelect";
import { useCreateObjective } from "@/hooks/useOkrs";
import { useQuarter } from "@/lib/QuarterContext";
import { Plus, X } from "lucide-react";

interface Props {
  teamId: string;
  onCreated?: () => void;
}

export function NewObjectiveForm({ teamId, onCreated }: Props) {
  const { active } = useQuarter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [owner, setOwner] = useState<string | null>(null);

  const createObj = useCreateObjective();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createObj.mutate(
      {
        teamId,
        title: title.trim(),
        focus: focus.trim() || undefined,
        quarter: active.quarter,
        year: active.year,
        owner: owner ?? undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setFocus("");
          setOwner(null);
          setOpen(false);
          onCreated?.();
        },
      }
    );
  };

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1" />
        New objective
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">New objective</p>
          <p className="text-xs text-muted-foreground">
            {active.quarter} {active.year}
          </p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Title *</Label>
        <Input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Objective title"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Focus (optional)</Label>
        <Input
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="Context or focus area"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs">Owner (optional)</Label>
        <MemberSelect value={owner} onChange={setOwner} triggerClassName="w-full" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={createObj.isPending}>
          {createObj.isPending ? "Creating…" : "Create objective"}
        </Button>
      </div>
    </form>
  );
}
