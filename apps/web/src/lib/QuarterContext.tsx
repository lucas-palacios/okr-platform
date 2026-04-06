import { createContext, useContext, useState, type ReactNode } from "react";

export interface Quarter {
  quarter: string; // "Q1", "Q2", "Q3", "Q4"
  year: number;
}

interface QuarterContextValue {
  active: Quarter;
  setActive: (q: Quarter) => void;
}

const QuarterContext = createContext<QuarterContextValue | null>(null);

export function QuarterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Quarter>({ quarter: "Q2", year: 2026 });

  return (
    <QuarterContext.Provider value={{ active, setActive }}>
      {children}
    </QuarterContext.Provider>
  );
}

export function useQuarter(): QuarterContextValue {
  const ctx = useContext(QuarterContext);
  if (!ctx) throw new Error("useQuarter must be used inside <QuarterProvider>");
  return ctx;
}
