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

  const topRange = [...vehicles]
    .sort((a, b) => b.realWorldRange.mixed - a.realWorldRange.mixed)
    .slice(0, 5);

  const handleCheck = () => {
    if (from && to) setChecked(true);
  };

  return (
    <div className="flex flex-col min-h-full px-5 md:px-10 pt-2 pb-8">
      <TopBar />
      <Drawer />

      <div className="max-w-3xl mx-auto w-full">
        <h2 className="text-[26px] md:text-[32px] font-bold mt-6">Range estimator</h2>
        <p className="text-sm text-ink-secondary mt-1">
          See which EVs can handle your trip — adjusted for Australian conditions.
        </p>

        {/* From / To — side by side on desktop */}
        <div className="mt-6 md:flex md:items-end md:gap-4">
          <div className="flex-1 space-y-1">
            <span className="micro-label text-ink-tertiary">FROM</span>
            <Input
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setChecked(false);
              }}
              placeholder="e.g. Sydney CBD"
              className="rounded-[16px] border-2 border-border h-12 text-base focus:border-ink"
            />
          </div>
          <div className="flex justify-center py-2 md:py-0 md:pb-3">
            <div className="w-0.5 h-6 md:h-0.5 md:w-6 bg-border" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="micro-label text-ink-tertiary">TO</span>
            <Input
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setChecked(false);
              }}
              placeholder="e.g. Blue Mountains"
              className="rounded-[16px] border-2 border-border h-12 text-base focus:border-ink"
            />
          </div>
          <div className="mt-3 md:mt-0">
            <Button
              onClick={handleCheck}
              disabled={!from || !to}
              className="w-full md:w-auto h-12 px-8 rounded-[20px] bg-green text-ink font-semibold hover:bg-green/90 disabled:opacity-50"
            >
              Check →
            </Button>
          </div>
        </div>

        {checked && (
          <div className="mt-8 md:flex md:gap-8 md:items-start">
            <div className="md:w-80 flex-shrink-0">
              <div className="p-4 bg-green-light border border-green/30 rounded-[16px]">
                <p className="text-sm font-medium">
                  {from} → {to}
                </p>
                <p className="text-[24px] font-mono font-bold mt-1">~165 km</p>
                <p className="text-xs text-ink-secondary mt-1">
                  Adjusted for hills, A/C and speed
                </p>
              </div>
            </div>

            <div className="flex-1 mt-6 md:mt-0">
              <h3 className="font-semibold mb-3">CAN IT HANDLE THE TRIP?</h3>
              <div className="space-y-3">
                {topRange.map((ev) => {
                  const ok = ev.realWorldRange.mixed >= 165 * 1.2;
                  const risky = ev.realWorldRange.mixed >= 165;
                  return (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {ev.make} {ev.model}
                        </p>
                        <p className="text-xs text-ink-tertiary font-mono">
                          {ev.realWorldRange.mixed} km real range
                        </p>
                      </div>
                      <span className="text-lg">
                        {ok ? "✅" : risky ? "⚠️" : "❌"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-ink-tertiary mt-3">
                ⚠️ "Might need top-up" means you should plan a charging stop along
                the way.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
