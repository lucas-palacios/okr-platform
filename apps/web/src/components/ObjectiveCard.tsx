import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KrProgressBar } from "@/components/KrProgressBar";
import { KrStatusSelect } from "@/components/KrStatusSelect";
import { KrCheckIn } from "@/components/KrCheckIn";
import { KrSheet } from "@/components/KrSheet";
import { NewKrForm } from "@/components/NewKrForm";
import { MemberSelect, Avatar } from "@/components/MemberSelect";
import { CommentsSection } from "@/components/CommentsSection";
import { useUpdateObjective, useDeleteObjective, useMembers, useObjectiveComments } from "@/hooks/useOkrs";
import { STATUS_LABELS, OBJECTIVE_STATUSES } from "@/lib/utils";
import { Pencil, Trash2, Check, X, ExternalLink, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import type { Objective, KeyResult } from "@/lib/api";

interface Props {
  objective: Objective;
  keyResults: KeyResult[];
}

export function ObjectiveCard({ objective, keyResults }: Props) {
  const updateObj = useUpdateObjective();
  const deleteObj = useDeleteObjective();
  const { data: members = [] } = useMembers();
  const { data: comments = [] } = useObjectiveComments(objective.id);

  const ownerMember = members.find((m) => m.id === objective.owner) ?? null;

  // Title inline edit
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(objective.title);
  const titleRef = useRef<HTMLInputElement>(null);

  // KR sheet
  const [selectedKr, setSelectedKr] = useState<KeyResult | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Comments panel
  const [commentsOpen, setCommentsOpen] = useState(false);

  const saveTitle = () => {
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== objective.title) {
      updateObj.mutate({ id: objective.id, title: trimmed });
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveTitle();
    if (e.key === "Escape") {
      setTitleValue(objective.title);
      setEditingTitle(false);
    }
  };

  const handleStatusChange = (status: string) => {
    updateObj.mutate({ id: objective.id, status });
  };

  const handleOwnerChange = (owner: string | null) => {
    updateObj.mutate({ id: objective.id, owner: owner ?? undefined });
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    deleteObj.mutate(objective.id);
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-xs font-mono text-muted-foreground">
                {objective.teamName} · {objective.code}
              </p>

              {editingTitle ? (
                <div className="flex items-center gap-1">
                  <Input
                    ref={titleRef}
                    autoFocus
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    className="h-7 text-sm font-semibold"
                  />
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0" onClick={saveTitle}>
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 shrink-0"
                    onClick={() => {
                      setTitleValue(objective.title);
                      setEditingTitle(false);
                    }}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group">
                  <span
                    className="text-base font-semibold leading-snug cursor-pointer hover:text-primary transition-colors"
                    onClick={() => {
                      setTitleValue(objective.title);
                      setEditingTitle(true);
                    }}
                  >
                    {objective.title}
                  </span>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    onClick={() => {
                      setTitleValue(objective.title);
                      setEditingTitle(true);
                    }}
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <Link
                    to={`/objectives/${objective.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  >
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Select value={objective.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-6 text-xs px-2 py-0 rounded-full border border-border w-auto min-w-[90px]">
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
                    className="h-6 text-xs px-2"
                    onClick={handleDelete}
                    disabled={deleteObj.isPending}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-xs px-1"
                    onClick={() => setConfirmDelete(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-50 hover:opacity-100 hover:text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {objective.focus && (
            <p className="text-xs text-muted-foreground mt-1 italic">{objective.focus}</p>
          )}

          <div className="flex items-center gap-1.5 mt-2">
            {ownerMember ? (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Avatar initials={ownerMember.avatarInitials} size="xs" />
                <span>{ownerMember.name}</span>
              </span>
            ) : (
              <span className="text-xs text-muted-foreground/50">Sin responsable</span>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MemberSelect
                value={objective.owner}
                onChange={handleOwnerChange}
                triggerClassName="h-5 text-xs px-1.5 py-0 rounded border border-dashed border-border w-auto min-w-[90px] bg-transparent"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {keyResults.map((kr) => (
            <div key={kr.id} className="space-y-1.5 group/kr border-l-2 border-border pl-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  className="text-xs font-medium text-foreground/80 text-left hover:text-primary transition-colors flex-1 min-w-0"
                  onClick={() => setSelectedKr(kr)}
                >
                  <span className="font-mono text-muted-foreground mr-1">{kr.code}</span>
                  <span className="hover:underline underline-offset-2">{kr.title}</span>
                </button>
                <KrStatusSelect krId={kr.id} status={kr.status} />
              </div>
              <KrProgressBar kr={kr} />
              <div className="opacity-0 group-hover/kr:opacity-100 transition-opacity">
                <KrCheckIn krId={kr.id} currentValue={kr.currentValue} targetUnit={kr.targetUnit} />
              </div>
            </div>
          ))}

          {keyResults.length === 0 && (
            <p className="text-xs text-muted-foreground">No key results yet.</p>
          )}

          <NewKrForm objectiveId={objective.id} />

          {/* Comments collapsible section */}
          <div className="border-t border-border pt-2 mt-1">
            <button
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
              onClick={() => setCommentsOpen((v) => !v)}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>
                Comentarios{comments.length > 0 ? ` (${comments.length})` : ""}
              </span>
              {commentsOpen ? (
                <ChevronUp className="h-3 w-3 ml-auto" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-auto" />
              )}
            </button>
            {commentsOpen && <CommentsSection objectiveId={objective.id} />}
          </div>
        </CardContent>
      </Card>

      <KrSheet kr={selectedKr} open={!!selectedKr} onClose={() => setSelectedKr(null)} />
    </>
  );
}
