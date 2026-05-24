"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import { getAllVehicles } from "@/lib/algorithm";
import type { EV } from "@/lib/types";

export default function ComparePage() {
  const vehicles = getAllVehicles();
  const [carA, setCarA] = useState<EV | null>(null);
  const [carB, setCarB] = useState<EV | null>(null);

  const rows: { label: string; getVal: (v: EV) => string }[] = [
    { label: "Drive-away price", getVal: (v) => `$${(v.price / 1000).toFixed(0)}k` },
    { label: "Real-world range", getVal: (v) => `${v.realWorldRange.mixed} km` },
    { label: "Home charge time", getVal: (v) => `${Math.round(v.charging.batteryKwh / v.charging.maxAC)} hrs` },
    { label: "DC fast charge", getVal: (v) => `${v.charging.maxDC} kW` },
    { label: "Running cost", getVal: () => "~$4/100km" },
    { label: "Warranty", getVal: () => "5 years / unlimited km" },
  ];

  const getWinner = (label: string, a: string, b: string) => {
    const numA = parseFloat(a.replace(/[^0-9.]/g, ""));
    const numB = parseFloat(b.replace(/[^0-9.]/g, ""));
    if (isNaN(numA) || isNaN(numB)) return null;
    // Higher is better for range, charge speed; lower is better for price, charge time
    const higherBetter = ["Real-world range", "DC fast charge"].includes(label);
    return higherBetter ? (numA > numB ? "a" : numA < numB ? "b" : null) : numA < numB ? "a" : numA > numB ? "b" : null;
  };

  return (
    <div className="flex flex-col min-h-full px-5 pt-2 pb-8">
      <TopBar />
      <Drawer />

      <h2 className="text-[26px] font-bold mt-6">Compare</h2>
      <p className="text-sm text-ink-secondary mt-1">Side-by-side EV specs.</p>

      {/* Car selectors */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <CarSelector vehicles={vehicles} selected={carA} onSelect={setCarA} label="Car A" side="a" />
        <CarSelector vehicles={vehicles} selected={carB} onSelect={setCarB} label="Car B" side="b" />
      </div>

      {carA && carB && (
        <>
          {/* Spec rows */}
          <div className="mt-6 space-y-px">
            {rows.map((row) => {
              const valA = row.getVal(carA);
              const valB = row.getVal(carB);
              const winner = getWinner(row.label, valA, valB);
              return (
                <div
                  key={row.label}
                  className="grid grid-cols-[1fr_auto_1fr] items-center py-3 px-2 border-b border-border last:border-0"
                >
                  <span className={`text-sm text-right pr-2 ${winner === "a" ? "font-bold text-green-dark bg-green-light/50 py-1 px-2 rounded-lg" : "text-ink-secondary"}`}>
                    {valA}
                  </span>
                  <span className="micro-label text-ink-tertiary w-16 text-center">{row.label}</span>
                  <span className={`text-sm pl-2 ${winner === "b" ? "font-bold text-green-dark bg-green-light/50 py-1 px-2 rounded-lg" : "text-ink-secondary"}`}>
                    {valB}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom line */}
          <div className="mt-6 p-4 bg-surface-subtle rounded-[16px] text-sm text-ink-secondary">
            <span className="font-semibold text-ink">Bottom line:</span>{" "}
            The {carA.realWorldRange.mixed > carB.realWorldRange.mixed ? carA.make + " " + carA.model : carB.make + " " + carB.model} has better real-world range,{" "}
            {carA.charging.maxDC > carB.charging.maxDC ? "faster charging" : "more affordable pricing"}.
            Your final pick depends on which factor matters most for your driving.
          </div>
        </>
      )}
    </div>
  );
}

function CarSelector({
  vehicles,
  selected,
  onSelect,
  label,
  side,
}: {
  vehicles: EV[];
  selected: EV | null;
  onSelect: (v: EV | null) => void;
  label: string;
  side: "a" | "b";
}) {
  return (
    <div className="bg-surface-raised border border-border rounded-[16px] p-4">
      {selected ? (
        <div>
          <button
            onClick={() => onSelect(null)}
            className="micro-label text-ink-tertiary hover:text-ink float-right"
          >
            ✕
          </button>
          <div className="h-[60px] rounded-lg bg-gradient-to-b from-[#f0f0ee] to-[#e4e4e1] flex items-center justify-center mb-2">
            <span className="micro-label text-ink-tertiary">PHOTO</span>
          </div>
          <p className="text-sm font-bold">{selected.make} {selected.model}</p>
          <p className="text-xs text-ink-secondary">{selected.variant}</p>
          <span className="match-badge match-badge-mid text-xs mt-1 inline-block">
            {Math.min(99, Math.round((selected.realWorldRange.mixed / 500) * 100))}%
          </span>
        </div>
      ) : (
        <div>
          <span className="micro-label text-ink-tertiary">{label}</span>
          <div className="mt-2 space-y-1 max-h-[180px] overflow-y-auto">
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => onSelect(v)}
                className="block w-full text-left text-sm py-1.5 px-2 rounded-lg hover:bg-surface-subtle transition-colors"
              >
                {v.make} {v.model}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
