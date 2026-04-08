import { Progress } from "@/components/ui/progress";
import { progressPercent } from "@/lib/utils";
import { Avatar } from "@/components/MemberSelect";
import { useMembers } from "@/hooks/useOkrs";
import type { KeyResult } from "@/lib/api";

interface Props {
  kr: KeyResult;
}

export function KrProgressBar({ kr }: Props) {
  const pct = progressPercent(kr.currentValue, kr.targetValue, kr.baselineValue);
  const hasNumeric = kr.targetValue !== null;
  const { data: members = [] } = useMembers();
  const ownerMember = members.find((m) => m.id === kr.owner) ?? null;

  return (
    <div className="space-y-1">
      {hasNumeric ? (
        <>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {ownerMember && <Avatar initials={ownerMember.avatarInitials} size="xs" />}
              <span>
                {kr.currentValue ?? 0}
                {kr.targetUnit ? ` ${kr.targetUnit}` : ""}
              </span>
            </span>
            <span>
              target: {kr.targetValue}
              {kr.targetUnit ? ` ${kr.targetUnit}` : ""}
            </span>
          </div>
          <Progress value={pct} className="h-1.5" />
          <div className="text-right text-xs font-medium text-primary">{pct}%</div>
        </>
      ) : (
        <div className="flex items-center gap-1.5">
          {ownerMember && <Avatar initials={ownerMember.avatarInitials} size="xs" />}
          <p className="text-xs text-muted-foreground italic">Qualitative — no numeric target</p>
        </div>
      )}
    </div>
  );
}
