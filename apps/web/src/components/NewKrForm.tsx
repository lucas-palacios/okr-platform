import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberSelect } from "@/components/MemberSelect";
import { useCreateKeyResult } from "@/hooks/useOkrs";
import { Plus, X } from "lucide-react";

interface Props {
  objectiveId: string;
}

export function NewKrForm({ objectiveId }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [targetUnit, setTargetUnit] = useState("");
  const [owner, setOwner] = useState<string | null>(null);

  const createKr = useCreateKeyResult();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createKr.mutate(
      {
        objectiveId,
        title: title.trim(),
        category: category.trim() || undefined,
        targetValue: targetValue ? Number(targetValue) : undefined,
        targetUnit: targetUnit.trim() || undefined,
        status: "not-started",
        owner: owner ?? undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setCategory("");
          setTargetValue("");
          setTargetUnit("");
          setOwner(null);
          setOpen(false);
        },
      }
    );
  };

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-foreground text-xs h-7 justify-start"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add key result
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-md p-3 space-y-2 bg-muted/30">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Key result title *"
        className="h-8 text-sm"
      />
      <div className="grid grid-cols-3 gap-2">
        <Input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="h-7 text-xs"
        />
        <Input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="Target"
          className="h-7 text-xs"
        />
        <Input
          value={targetUnit}
          onChange={(e) => setTargetUnit(e.target.value)}
          placeholder="Unit (%…)"
          className="h-7 text-xs"
        />
      </div>
      <MemberSelect
        value={owner}
        onChange={setOwner}
        triggerClassName="w-full h-7 text-xs"
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => setOpen(false)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
        <Button type="submit" size="sm" className="h-7 text-xs" disabled={createKr.isPending}>
          {createKr.isPending ? "Adding…" : "Add KR"}
        </Button>
      </div>
    </form>
  );
}
