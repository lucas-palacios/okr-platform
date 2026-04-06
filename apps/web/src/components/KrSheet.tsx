import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateKeyResult, useDeleteKeyResult } from "@/hooks/useOkrs";
import { KR_STATUSES, STATUS_LABELS } from "@/lib/utils";
import { MemberSelect } from "@/components/MemberSelect";
import type { KeyResult } from "@/lib/api";
import { Trash2 } from "lucide-react";

interface Props {
  kr: KeyResult | null;
  open: boolean;
  onClose: () => void;
}

export function KrSheet({ kr, open, onClose }: Props) {
  const updateKr = useUpdateKeyResult();
  const deleteKr = useDeleteKeyResult();

  const [form, setForm] = useState<Partial<KeyResult>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (kr) {
      setForm({
        title: kr.title,
        category: kr.category ?? "",
        targetValue: kr.targetValue ?? undefined,
        targetUnit: kr.targetUnit ?? "",
        currentValue: kr.currentValue ?? 0,
        targetText: kr.targetText ?? "",
        status: kr.status,
        owner: kr.owner ?? "",
        dueDate: kr.dueDate ?? "",
        notes: kr.notes ?? "",
      });
      setConfirmDelete(false);
    }
  }, [kr]);

  if (!kr) return null;

  const set = (field: keyof KeyResult, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    const payload: Partial<Omit<KeyResult, "id" | "objectiveId" | "code">> = {
      title: form.title,
      category: form.category || null,
      targetValue: form.targetValue !== undefined ? Number(form.targetValue) : null,
      targetUnit: form.targetUnit || null,
      currentValue: form.currentValue !== undefined ? Number(form.currentValue) : null,
      targetText: form.targetText || null,
      status: form.status,
      owner: form.owner || null,
      dueDate: form.dueDate || null,
      notes: form.notes || null,
    };
    updateKr.mutate({ id: kr.id, ...payload }, { onSuccess: onClose });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteKr.mutate(kr.id, { onSuccess: onClose });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-lg">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-sm font-mono text-muted-foreground">{kr.code}</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-20">
          <Field label="Title">
            <Input
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Key result title"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Input
                value={form.category ?? ""}
                onChange={(e) => set("category", e.target.value)}
                placeholder="e.g. SLO, Hito"
              />
            </Field>
            <Field label="Status">
              <Select value={form.status ?? kr.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KR_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s] ?? s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Current value">
              <Input
                type="number"
                value={form.currentValue ?? ""}
                onChange={(e) => set("currentValue", e.target.value)}
              />
            </Field>
            <Field label="Target value">
              <Input
                type="number"
                value={form.targetValue ?? ""}
                onChange={(e) => set("targetValue", e.target.value)}
              />
            </Field>
            <Field label="Unit">
              <Input
                value={form.targetUnit ?? ""}
                onChange={(e) => set("targetUnit", e.target.value)}
                placeholder="%, min…"
              />
            </Field>
          </div>

          <Field label="Qualitative target text">
            <Input
              value={form.targetText ?? ""}
              onChange={(e) => set("targetText", e.target.value)}
              placeholder="Human-readable target"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Owner">
              <MemberSelect
                value={form.owner ?? null}
                onChange={(v) => setForm((prev) => ({ ...prev, owner: v ?? "" }))}
                triggerClassName="w-full"
              />
            </Field>
            <Field label="Due date">
              <Input
                type="date"
                value={form.dueDate ?? ""}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notes">
            <Textarea
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Any notes..."
              rows={3}
            />
          </Field>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 bg-background border-t px-6 py-3 flex flex-row justify-between gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteKr.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {confirmDelete ? "Confirm delete" : "Delete KR"}
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={updateKr.isPending}>
              {updateKr.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
