"use client";

import { Button } from "@/components/ui/button";
import type { ScoredEV } from "@/lib/types";

export default function ResultCard({
  ev,
  rank,
}: {
  ev: ScoredEV;
  rank: number;
}) {
  const matchLevel =
    ev.matchPercent >= 90 ? "high" : ev.matchPercent >= 80 ? "mid" : "low";

  return (
    <div
      className={`bg-surface-raised rounded-[20px] p-5 transition-all duration-200 ${
        rank === 1
          ? "border-2 border-ink shadow-[0_0_0_1px_#3ecf72,0_8px_24px_rgba(62,207,114,0.10)]"
          : "border border-border shadow-sm"
      }`}
    >
      {/* Top pick badge */}
      {rank === 1 && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-xs font-semibold text-green-dark bg-green-light px-2.5 py-1 rounded-full">
            ★ TOP PICK
          </span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <span className="micro-label text-ink-tertiary">#{rank}</span>
          <h3 className="text-lg font-bold mt-0.5">
            {ev.make} {ev.model}
          </h3>
          <span className="text-sm text-ink-secondary">{ev.variant}</span>
        </div>
        <span className={`match-badge match-badge-${matchLevel}`}>
          {ev.matchPercent}%
        </span>
      </div>

      {/* Car photo placeholder */}
      <div className="mt-3 h-[90px] rounded-xl bg-gradient-to-b from-[#f0f0ee] to-[#e4e4e1] flex items-center justify-center">
        <span className="micro-label text-ink-tertiary">CAR PHOTO</span>
      </div>

      {/* Spec strip */}
      <div className="mt-4 grid grid-cols-3 divide-x divide-border border border-border rounded-xl overflow-hidden">
        <div className="text-center py-2.5">
          <span className="micro-label text-ink-tertiary">REAL RANGE</span>
          <p className="text-sm font-bold mt-0.5">{ev.realWorldRange.mixed}km</p>
        </div>
        <div className="text-center py-2.5">
          <span className="micro-label text-ink-tertiary">DC CHARGE</span>
          <p className="text-sm font-bold mt-0.5">{ev.charging.maxDC}kW</p>
        </div>
        <div className="text-center py-2.5">
          <span className="micro-label text-ink-tertiary">DRIVE-AWAY</span>
          <p className="text-sm font-bold mt-0.5">
            ${(ev.price / 1000).toFixed(0)}k
          </p>
        </div>
      </div>

      {/* Reasons */}
      <div className="mt-3 space-y-1.5">
        {ev.reasons.slice(0, 3).map((r) => (
          <div key={r} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span className="text-green-dark mt-0.5 flex-shrink-0">✓</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2">
        <Button className="flex-[2] rounded-[20px] bg-green text-ink font-semibold hover:bg-green/90 h-11">
          Full details
        </Button>
        <Button
          variant="secondary"
          className="flex-1 rounded-[20px] bg-surface-subtle text-ink font-medium hover:bg-surface-subtle/80 h-11"
        >
          Test drive
        </Button>
      </div>
    </div>
  );
}
