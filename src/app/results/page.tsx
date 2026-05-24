"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import ResultCard from "@/components/ResultCard";
import { computeResults } from "@/lib/algorithm";
import type { BudgetBucket, ChargeOption } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function ResultsPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-full px-5 py-32">
        <p className="text-ink-secondary">Loading results...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const sp = useSearchParams();

  const km = Number(sp.get("km") || 45);
  const charge = (sp.get("charge")?.split(",").filter(Boolean) || []) as ChargeOption[];
  const budget = sp.get("budget") as BudgetBucket | null;

  const results = useMemo(() => {
    if (!budget) return [];
    return computeResults({ km, charge, budget });
  }, [km, charge, budget]);

  const budgetLabels: Record<string, string> = {
    u40: "Under $40k",
    "40-55": "$40k–$55k",
    "55-75": "$55k–$75k",
    o75: "Over $75k",
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-5 py-32">
        <p className="text-ink-secondary">No results — take the quiz first.</p>
        <Button
          onClick={() => (window.location.href = "/quiz")}
          className="mt-4 rounded-[20px] bg-green text-ink font-semibold"
        >
          Take the quiz →
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full px-5 md:px-10 pt-2 pb-8">
      <TopBar />
      <Drawer />

      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-[26px] md:text-[32px] font-bold mt-6">Your shortlist 🎉</h2>

        {/* Filter summary */}
        <div className="mt-4 p-4 bg-surface-subtle border border-border rounded-[16px] flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-secondary">Based on:</span>
          <span className="tag tag-green">{km} km/day</span>
          <span className="tag tag-blue">{budgetLabels[budget || ""]}</span>
          {charge.includes("home") && <span className="tag tag-yellow">Home charging</span>}
          <a href="/quiz?step=1" className="ml-auto text-xs text-ink-secondary underline">
            Change →
          </a>
        </div>

        {/* Results — side by side on desktop */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.slice(0, 3).map((ev, i) => (
            <ResultCard key={ev.id} ev={ev} rank={i + 1} />
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => (window.location.href = "/compare")}
            className="text-sm text-ink-secondary underline hover:text-ink"
          >
            ↔ Compare top 2 side by side
          </button>
        </div>
      </div>
    </div>
  );
}
