import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/MemberSelect";
import { useMembers, useObjectiveComments, useCreateObjectiveComment, useDeleteObjectiveComment } from "@/hooks/useOkrs";
import { Trash2 } from "lucide-react";

interface Props {
  objectiveId: string;
}

function formatRelativeDate(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "ahora";
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffHour < 24) return `hace ${diffHour}h`;
  if (diffDay < 7) return `hace ${diffDay}d`;
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function CommentsSection({ objectiveId }: Props) {
  const { data: comments = [], isLoading } = useObjectiveComments(objectiveId);
  const { data: members = [] } = useMembers();
  const createComment = useCreateObjectiveComment(objectiveId);
  const deleteComment = useDeleteObjectiveComment(objectiveId);

  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [bodyText, setBodyText] = useState("");

  const handleSubmit = () => {
    const author = selectedAuthorId
      ? (members.find((m) => m.id === selectedAuthorId)?.name ?? selectedAuthorId)
      : "";

    if (!author.trim() || !bodyText.trim()) return;

    createComment.mutate(
      { author: author.trim(), body: bodyText.trim() },
      {
        onSuccess: () => {
          setBodyText("");
          setSelectedAuthorId("");
        },
      }
    );
  };

  if (isLoading) {
    return <p className="text-xs text-muted-foreground py-2">Cargando comentarios...</p>;
  }

  return (
    <div className="space-y-3 pt-2">
      {/* Comment list */}
      {comments.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Sin comentarios aún</p>
      ) : (
        <ul className="space-y-2.5">
          {comments.map((comment) => {
            const initials = getInitials(comment.author);
            return (
              <li key={comment.id} className="flex items-start gap-2 group/comment">
                <Avatar initials={initials} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-foreground">{comment.author}</span>
                    <span className="text-[10px] text-muted-foreground">{formatRelativeDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed whitespace-pre-wrap">{comment.body}</p>
                </div>
                <button
                  className="opacity-0 group-hover/comment:opacity-100 transition-opacity shrink-0 p-0.5 hover:text-destructive text-muted-foreground"
                  onClick={() => deleteComment.mutate(comment.id)}
                  disabled={deleteComment.isPending}
                  aria-label="Eliminar comentario"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* New comment form */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <select
          className="w-full text-xs rounded-md border border-input bg-background px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          value={selectedAuthorId}
          onChange={(e) => setSelectedAuthorId(e.target.value)}
        >
          <option value="">Seleccionar autor...</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <Textarea
          placeholder="Escribir comentario..."
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          className="text-xs min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
          }}
        />
        <Button
          size="sm"
          className="h-6 text-xs px-3"
          onClick={handleSubmit}
          disabled={!selectedAuthorId || !bodyText.trim() || createComment.isPending}
        >
          Comentar
        </Button>
      </div>
    </div>
  );
}
