import { useObjectives, useKeyResults } from "@/hooks/useOkrs";
import { ObjectiveCard } from "@/components/ObjectiveCard";
import { NewObjectiveForm } from "@/components/NewObjectiveForm";
import { progressPercent } from "@/lib/utils";
import { useQuarter } from "@/lib/QuarterContext";
import type { KeyResult } from "@/lib/api";

function overallProgress(krs: KeyResult[]): number {
  const numeric = krs.filter((kr) => kr.targetValue !== null);
  if (numeric.length === 0) return 0;
  const sum = numeric.reduce((acc, kr) => acc + progressPercent(kr.currentValue, kr.targetValue), 0);
  return Math.round(sum / numeric.length);
}

export function Dashboard() {
  const { active } = useQuarter();
  const { data: objectives, isLoading: loadingObj } = useObjectives({
    quarter: active.quarter,
    year: active.year,
  });
  const { data: allKrs, isLoading: loadingKrs } = useKeyResults();

  if (loadingObj || loadingKrs) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading OKRs...</p>
      </div>
    );
  }

  const objectiveList = objectives ?? [];
  const krList = allKrs ?? [];

  const totalProgress = overallProgress(krList);
  const byTeam = {
    infra: objectiveList.filter((o) => o.teamId === "infra"),
    cs: objectiveList.filter((o) => o.teamId === "cs"),
  };

  const getKrsForObjective = (objectiveId: string) =>
    krList.filter((kr) => kr.objectiveId === objectiveId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {active.quarter} {active.year} — OKRs Overview
        </h1>
        <p className="text-muted-foreground">
          2 teams · {objectiveList.length} objectives · {krList.length} key results
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatCard label="Overall progress" value={`${totalProgress}%`} />
        <StatCard label="Objectives" value={String(objectiveList.length)} />
        <StatCard label="Key Results" value={String(krList.length)} />
        <StatCard
          label="On track"
          value={String(krList.filter((kr) => kr.status === "on-track").length)}
          sub={`of ${krList.length}`}
        />
      </div>

      {/* Infraestructura */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Infraestructura</h2>
          <span className="text-xs text-muted-foreground">{byTeam.infra.length} objectives</span>
        </div>
        {byTeam.infra.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {byTeam.infra.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                keyResults={getKrsForObjective(obj.id)}
              />
            ))}
          </div>
        )}
        <NewObjectiveForm teamId="infra" />
      </section>

      {/* Customer Success */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Customer Success</h2>
          <span className="text-xs text-muted-foreground">{byTeam.cs.length} objectives</span>
        </div>
        {byTeam.cs.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {byTeam.cs.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                keyResults={getKrsForObjective(obj.id)}
              />
            ))}
          </div>
        )}
        <NewObjectiveForm teamId="cs" />
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
