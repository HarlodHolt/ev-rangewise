"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import OptionCard from "@/components/OptionCard";

export default function QuizPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-full px-5 py-32">
        <p className="text-ink-secondary">Loading...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}

const quickPicks = [20, 40, 60, 100, 150] as const;

const chargeOptions = [
  { value: "home" as const, emoji: "🏠", label: "At home overnight", sub: "Garage or driveway charger" },
  { value: "work" as const, emoji: "🏢", label: "At work", sub: "Charger in the car park" },
  { value: "public" as const, emoji: "⚡", label: "Public chargers", sub: "Shopping centres, on-street" },
  { value: "unsure" as const, emoji: "🤔", label: "Not sure yet", sub: "I'll work it out" },
] as const;

const budgetOptions = [
  { value: "u40" as const, emoji: "💚", label: "Under $40k", sub: "Entry-level EVs, great value" },
  { value: "40-55" as const, emoji: "💛", label: "$40k – $55k", sub: "Sweet spot for Aussie buyers" },
  { value: "55-75" as const, emoji: "🧡", label: "$55k – $75k", sub: "Mid-range premium models" },
  { value: "o75" as const, emoji: "❤️", label: "Over $75k", sub: "Performance or luxury" },
] as const;

type Budget = (typeof budgetOptions)[number]["value"];
type Charge = (typeof chargeOptions)[number]["value"];

function getKmTag(km: number) {
  if (km < 40) return { text: "Short trips around town", cls: "tag-green" };
  if (km < 80) return { text: "Moderate daily commute", cls: "tag-blue" };
  if (km < 130) return { text: "Longer daily drive", cls: "tag-yellow" };
  return { text: "Big daily distance", cls: "tag-green" };
}

function QuizContent() {
  const router = useRouter();
  const sp = useSearchParams();

  const [step, setStep] = useState(Number(sp.get("step") || 1) as 1 | 2 | 3);
  const [km, setKmState] = useState(Number(sp.get("km") || 45));
  const [charge, setChargeState] = useState<Charge[]>(
    (sp.get("charge")?.split(",").filter(Boolean) as Charge[]) || []
  );
  const [budget, setBudgetState] = useState<Budget | null>(
    (sp.get("budget") as Budget) || null
  );
  const [sliderValue, setSliderValue] = useState([km]);

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams();
      if (step > 1) params.set("step", String(step));
      if (km !== 45) params.set("km", String(km));
      if (charge.length) params.set("charge", charge.join(","));
      if (budget) params.set("budget", budget);
      Object.entries(updates).forEach(([k, v]) => params.set(k, v));
      router.replace(`/quiz?${params.toString()}`, { scroll: false });
    },
    [step, km, charge, budget, router]
  );

  const progress = (step / 3) * 100;

  const handleKmChange = (v: number | readonly number[]) => {
    const arr = Array.isArray(v) ? v : [v];
    setSliderValue([...arr]);
    setKmState(arr[0]);
    updateUrl({ km: String(arr[0]) });
  };

  const toggleCharge = (opt: Charge) => {
    const next = charge.includes(opt)
      ? charge.filter((c) => c !== opt)
      : [...charge, opt];
    setChargeState(next);
    updateUrl({ charge: next.join(",") });
  };

  const handleBudget = (opt: Budget) => {
    setBudgetState(opt);
    updateUrl({ budget: opt });
  };

  const goToStep = (s: 1 | 2 | 3) => {
    setStep(s);
    const params = new URLSearchParams();
    params.set("step", String(s));
    if (km !== 45) params.set("km", String(km));
    if (charge.length && s >= 2) params.set("charge", charge.join(","));
    if (budget && s >= 3) params.set("budget", budget);
    router.push(`/quiz?${params.toString()}`, { scroll: false });
  };

  const canProceed = step === 1 ? true : step === 2 ? charge.length > 0 : budget !== null;

  const handleNext = () => {
    if (step < 3) goToStep((step + 1) as 1 | 2 | 3);
    else {
      const params = new URLSearchParams();
      params.set("km", String(km));
      params.set("charge", charge.join(","));
      params.set("budget", budget || "");
      router.push(`/results?${params.toString()}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-5 md:px-10 pt-2">
      <TopBar />
      <Drawer />

      {/* Progress */}
      <div className="flex items-center gap-3 mt-2 max-w-2xl mx-auto w-full">
        <button
          onClick={() => (step > 1 ? goToStep((step - 1) as 1 | 2 | 3) : router.push("/"))}
          className="text-sm text-ink-secondary hover:text-ink"
        >
          ←
        </button>
        <Progress value={progress} className="flex-1 h-1 bg-border [&>div]:bg-ink" />
        <span className="micro-label text-ink-tertiary">{step}/3</span>
      </div>

      <div className="mt-8 flex-1 max-w-2xl mx-auto w-full">
        <span className="tag tag-green text-xs">Question {step} of 3</span>

        {step === 1 && (
          <div className="mt-4 md:mt-8 md:flex md:gap-12 md:items-center">
            <div className="md:flex-1">
              <h2 className="text-[26px] md:text-[32px] font-bold leading-tight">
                How far do you drive each day?
              </h2>
              <p className="text-sm text-ink-secondary mt-1">
                Think about your most common days — not your big weekend road trips.
              </p>

              <div className="mt-6 flex gap-2 flex-wrap">
                {quickPicks.map((qkm) => (
                  <button
                    key={qkm}
                    onClick={() => handleKmChange([qkm] as readonly number[])}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      sliderValue[0] === qkm
                        ? "bg-ink text-white"
                        : "bg-surface-subtle text-ink-secondary hover:bg-border"
                    }`}
                  >
                    {qkm} km
                  </button>
                ))}
              </div>
            </div>

            <div className="md:flex-1 mt-8 md:mt-0">
              <div className="text-center">
                <p className="text-[72px] md:text-[96px] font-mono font-bold leading-none tracking-tight">
                  {sliderValue[0]}
                </p>
                <p className="text-sm text-ink-secondary mt-1">km / day</p>
                <span className={`tag mt-2 inline-block ${getKmTag(sliderValue[0]).cls}`}>
                  {getKmTag(sliderValue[0]).text}
                </span>
              </div>
              <div className="mt-8 px-2">
                <Slider
                  value={sliderValue}
                  onValueChange={handleKmChange}
                  min={5}
                  max={200}
                  step={5}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-ink [&_[role=slider]]:shadow-md [&_[role=slider]]:w-6 [&_[role=slider]]:h-6"
                />
                <div className="flex justify-between mt-2 text-xs text-ink-tertiary font-mono">
                  <span>5 km</span>
                  <span>200 km</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-4 md:mt-8">
            <h2 className="text-[26px] md:text-[32px] font-bold leading-tight">Where will you charge it?</h2>
            <p className="text-sm text-ink-secondary mt-1">Pick everything that applies to you.</p>
            <div className="mt-6 md:grid md:grid-cols-2 md:gap-4 space-y-3 md:space-y-0">
              {chargeOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  sub={opt.sub}
                  selected={charge.includes(opt.value)}
                  onClick={() => toggleCharge(opt.value)}
                />
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-4 md:mt-8">
            <h2 className="text-[26px] md:text-[32px] font-bold leading-tight">What's your budget?</h2>
            <p className="text-sm text-ink-secondary mt-1">Drive-away price, all-in.</p>
            <div className="mt-6 md:grid md:grid-cols-2 md:gap-4 space-y-3 md:space-y-0">
              {budgetOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  emoji={opt.emoji}
                  label={opt.label}
                  sub={opt.sub}
                  selected={budget === opt.value}
                  onClick={() => handleBudget(opt.value)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="py-5 max-w-2xl mx-auto w-full">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full md:w-auto md:min-w-[200px] h-[54px] rounded-[20px] bg-green text-ink font-semibold text-[17px] hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step < 3 ? "Next →" : "See my shortlist →"}
        </Button>
      </div>
    </div>
  );
}
