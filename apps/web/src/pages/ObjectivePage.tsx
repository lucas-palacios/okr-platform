import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useObjective, useKeyResultsByObjective, useUpdateObjective, useDeleteObjective } from "@/hooks/useOkrs";
import { KrProgressBar } from "@/components/KrProgressBar";
import { KrStatusSelect } from "@/components/KrStatusSelect";
import { KrCheckIn } from "@/components/KrCheckIn";
import { KrSheet } from "@/components/KrSheet";
import { NewKrForm } from "@/components/NewKrForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_LABELS, OBJECTIVE_STATUSES } from "@/lib/utils";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import type { KeyResult } from "@/lib/api";

export function ObjectivePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: obj, isLoading: loadingObj } = useObjective(id!);
  const { data: krs, isLoading: loadingKrs } = useKeyResultsByObjective(id!);
  const updateObj = useUpdateObjective();
  const deleteObj = useDeleteObjective();

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [selectedKr, setSelectedKr] = useState<KeyResult | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (loadingObj || loadingKrs) return <p className="text-muted-foreground">Loading...</p>;
  if (!obj) return <p className="text-destructive">Objective not found.</p>;

  const krList = krs ?? [];

  const saveTitle = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== obj.title) {
      updateObj.mutate({ id: obj.id, title: trimmed });
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveTitle();
    if (e.key === "Escape") setEditingTitle(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteObj.mutate(obj.id, {
      onSuccess: () => navigate(`/teams/${obj.teamId}`),
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <p className="text-sm text-muted-foreground">
        <Link to="/" className="hover:underline">Dashboard</Link>
        {" / "}
        <Link to={`/teams/${obj.teamId}`} className="hover:underline capitalize">{obj.teamName}</Link>
        {" / "}
        {obj.code}
      </p>

      {/* Objective header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-muted-foreground mb-1">
              {obj.teamName} · {obj.code} · {obj.quarter} {obj.year}
            </p>

            {editingTitle ? (
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  className="text-xl font-bold h-9"
                />
                <Button size="sm" variant="ghost" onClick={saveTitle}>
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingTitle(false)}>
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-xl font-bold leading-snug">{obj.title}</h1>
                <button
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setTitleValue(obj.title);
                    setEditingTitle(true);
                  }}
                >
                  <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Select value={obj.status} onValueChange={(s) => updateObj.mutate({ id: obj.id, status: s })}>
              <SelectTrigger className="h-8 text-xs w-auto min-w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OBJECTIVE_STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABELS[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {confirmDelete ? (
              <>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteObj.isPending}
                >
                  Confirm delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {obj.focus && (
          <p className="text-sm text-muted-foreground italic border-l-2 border-etendo-blue pl-3">
            {obj.focus}
          </p>
        )}
      </div>

      <Separator />

      {/* Key Results */}
      <div className="space-y-4">
        <h2 className="font-semibold text-base">
          Key Results{" "}
          <span className="text-muted-foreground font-normal text-sm">({krList.length})</span>
        </h2>

        {krList.map((kr) => (
          <Card key={kr.id} className="group/kr">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-muted-foreground mb-0.5">
                    {kr.code} · {kr.category}
                  </p>
                  <button
                    className="text-left w-full"
                    onClick={() => setSelectedKr(kr)}
                  >
                    <CardTitle className="text-sm font-medium leading-snug hover:text-primary transition-colors hover:underline underline-offset-2">
                      {kr.title}
                    </CardTitle>
                  </button>
                </div>
                <KrStatusSelect krId={kr.id} status={kr.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <KrProgressBar kr={kr} />
              {kr.targetText && (
                <p className="text-xs text-muted-foreground">{kr.targetText}</p>
              )}
              <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                {kr.owner && <span>Owner: <strong>{kr.owner}</strong></span>}
                {kr.dueDate && <span>Due: <strong>{kr.dueDate}</strong></span>}
              </div>
              <KrCheckIn krId={kr.id} currentValue={kr.currentValue} targetUnit={kr.targetUnit} />
            </CardContent>
          </Card>
        ))}

        <NewKrForm objectiveId={obj.id} />
      </div>

      <KrSheet kr={selectedKr} open={!!selectedKr} onClose={() => setSelectedKr(null)} />
    </div>
  );
}
