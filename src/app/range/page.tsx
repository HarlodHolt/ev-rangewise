"use client";

import { useState } from "react";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllVehicles } from "@/lib/algorithm";

export default function RangePage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [checked, setChecked] = useState(false);
  const vehicles = getAllVehicles();

  const topRange = [...vehicles].sort((a, b) => b.realWorldRange.mixed - a.realWorldRange.mixed).slice(0, 5);

  const handleCheck = () => { if (from && to) setChecked(true); };

  return (
    <div className="flex flex-col min-h-full px-5 pt-2 pb-8">
      <TopBar />
      <Drawer />

      <h2 className="text-[26px] font-bold mt-6">Range estimator</h2>
      <p className="text-sm text-ink-secondary mt-1">
        See which EVs can handle your trip — adjusted for Australian conditions.
      </p>

      {/* From / To */}
      <div className="mt-6 space-y-1">
        <span className="micro-label text-ink-tertiary">FROM</span>
        <Input
          value={from}
          onChange={(e) => { setFrom(e.target.value); setChecked(false); }}
          placeholder="e.g. Sydney CBD"
          className="rounded-[16px] border-2 border-border h-12 text-base focus:border-ink"
        />
      </div>
      <div className="flex justify-center py-1">
        <div className="w-0.5 h-4 bg-border" />
      </div>
      <div className="space-y-1">
        <span className="micro-label text-ink-tertiary">TO</span>
        <Input
          value={to}
          onChange={(e) => { setTo(e.target.value); setChecked(false); }}
          placeholder="e.g. Blue Mountains"
          className="rounded-[16px] border-2 border-border h-12 text-base focus:border-ink"
        />
      </div>

      <Button
        onClick={handleCheck}
        disabled={!from || !to}
        className="w-full mt-4 h-[54px] rounded-[20px] bg-green text-ink font-semibold text-[17px] hover:bg-green/90 disabled:opacity-50"
      >
        Check range →
      </Button>

      {checked && (
        <div className="mt-6">
          <div className="p-4 bg-green-light border border-green/30 rounded-[16px]">
            <p className="text-sm font-medium">
              {from} → {to}
            </p>
            <p className="text-[24px] font-mono font-bold mt-1">~165 km</p>
            <p className="text-xs text-ink-secondary mt-1">
              Adjusted for hills, A/C and speed
            </p>
          </div>

          <h3 className="font-semibold mt-6 mb-3">CAN IT HANDLE THE TRIP?</h3>
          <div className="space-y-3">
            {topRange.map((ev) => {
              const ok = ev.realWorldRange.mixed >= 165 * 1.2;
              const risky = ev.realWorldRange.mixed >= 165;
              return (
                <div key={ev.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium">{ev.make} {ev.model}</p>
                    <p className="text-xs text-ink-tertiary font-mono">{ev.realWorldRange.mixed} km real range</p>
                  </div>
                  <span className="text-lg">
                    {ok ? "✅" : risky ? "⚠️" : "❌"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-ink-tertiary mt-3">
            ⚠️ "Might need top-up" means you should plan a charging stop along the way.
          </p>
        </div>
      )}
    </div>
  );
}
