import { useParams, Link } from "react-router-dom";
import { useObjectives, useKeyResults } from "@/hooks/useOkrs";
import { ObjectiveCard } from "@/components/ObjectiveCard";
import { NewObjectiveForm } from "@/components/NewObjectiveForm";
import { useQuarter } from "@/lib/QuarterContext";

const TEAM_LABELS: Record<string, string> = {
  infra: "Infraestructura",
  cs: "Customer Success",
};

export function TeamPage() {
  const { id } = useParams<{ id: string }>();
  const { active } = useQuarter();
  const { data: objectives, isLoading } = useObjectives({
    team: id,
    quarter: active.quarter,
    year: active.year,
  });
  const { data: allKrs } = useKeyResults();

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  const objList = objectives ?? [];
  const krList = allKrs ?? [];

  const getKrsForObjective = (objectiveId: string) =>
    krList.filter((kr) => kr.objectiveId === objectiveId);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">Dashboard</Link> / {TEAM_LABELS[id ?? ""] ?? id}
        </p>
        <h1 className="text-2xl font-bold">{TEAM_LABELS[id ?? ""] ?? id}</h1>
        <p className="text-muted-foreground">
          {active.quarter} {active.year} · {objList.length} objectives
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {objList.map((obj) => (
          <ObjectiveCard
            key={obj.id}
            objective={obj}
            keyResults={getKrsForObjective(obj.id)}
          />
        ))}
      </div>

      <NewObjectiveForm teamId={id ?? ""} />
    </div>
  );
}
