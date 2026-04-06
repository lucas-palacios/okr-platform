import { useState } from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { useQuarter, type Quarter } from "@/lib/QuarterContext";
import { useQuarters } from "@/hooks/useOkrs";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function QuarterSelector() {
  const { active, setActive } = useQuarter();
  const { data: quarters } = useQuarters();
  const qc = useQueryClient();

  const [showNewForm, setShowNewForm] = useState(false);
  const [newQ, setNewQ] = useState("Q3");
  const [newYear, setNewYear] = useState(String(new Date().getFullYear()));
  const [newFormError, setNewFormError] = useState("");

  const label = `${active.quarter} ${active.year}`;

  // Build list: quarters from DB + active quarter (in case it's not in DB yet)
  const dbList = quarters ?? [];
  const allEntries: Quarter[] = [];
  const seen = new Set<string>();

  // Always include the active quarter first
  const activeKey = `${active.quarter}-${active.year}`;
  allEntries.push(active);
  seen.add(activeKey);

  for (const q of dbList) {
    const key = `${q.quarter}-${q.year}`;
    if (!seen.has(key)) {
      allEntries.push({ quarter: q.quarter, year: q.year });
      seen.add(key);
    }
  }

  // Sort: newest first
  allEntries.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.quarter.localeCompare(a.quarter);
  });

  function handleSelect(q: Quarter) {
    setActive(q);
    // Invalidate all queries that depend on quarter
    qc.invalidateQueries({ queryKey: ["objectives"] });
    qc.invalidateQueries({ queryKey: ["key-results"] });
  }

  function handleAddNew() {
    setNewFormError("");
    const qNum = parseInt(newQ.replace(/\D/g, ""), 10);
    const year = parseInt(newYear, 10);

    if (!newQ.match(/^Q[1-4]$/i)) {
      setNewFormError("Quarter must be Q1, Q2, Q3 or Q4");
      return;
    }
    if (isNaN(year) || year < 2020 || year > 2035) {
      setNewFormError("Year must be between 2020 and 2035");
      return;
    }

    const normalized = `Q${qNum}`;
    handleSelect({ quarter: normalized, year });
    setShowNewForm(false);
    setNewQ("Q3");
    setNewYear(String(new Date().getFullYear()));
    // Refresh quarters list so the new one shows up
    qc.invalidateQueries({ queryKey: ["quarters"] });
  }

  return (
    <DropdownMenu onOpenChange={(open) => { if (!open) setShowNewForm(false); }}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
            "bg-etendo-blue text-white hover:bg-etendo-blue/90 transition-colors"
          )}
        >
          {label}
          <ChevronDown className="h-3 w-3 opacity-80" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        {allEntries.map((q) => {
          const isActive = q.quarter === active.quarter && q.year === active.year;
          return (
            <DropdownMenuItem
              key={`${q.quarter}-${q.year}`}
              onClick={() => handleSelect(q)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>
                {q.quarter} {q.year}
              </span>
              {isActive && <Check className="h-3.5 w-3.5 text-etendo-blue" />}
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        {!showNewForm ? (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setShowNewForm(true);
            }}
            className="cursor-pointer text-etendo-blue font-medium"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New quarter
          </DropdownMenuItem>
        ) : (
          <div
            className="px-2 py-2 space-y-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Quarter</Label>
                <Input
                  className="h-7 text-xs"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value.toUpperCase())}
                  placeholder="Q3"
                  maxLength={2}
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label className="text-xs">Year</Label>
                <Input
                  className="h-7 text-xs"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  placeholder="2026"
                  maxLength={4}
                />
              </div>
            </div>
            {newFormError && (
              <p className="text-xs text-destructive">{newFormError}</p>
            )}
            <div className="flex gap-1.5">
              <Button
                size="sm"
                className="h-7 text-xs flex-1"
                onClick={handleAddNew}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs"
                onClick={() => {
                  setShowNewForm(false);
                  setNewFormError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
