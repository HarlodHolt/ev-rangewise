import type { EV, Answers, ScoredEV } from "./types";
import evsData from "@/data/evs.json";

const vehicles: EV[] = (evsData as { vehicles: EV[] }).vehicles;

export function computeResults(answers: Answers): ScoredEV[] {
  const scored = vehicles
    .map((ev) => {
      let score = 0;
      const reasons: string[] = [];

      // Range fit (50% weight)
      const neededRange = answers.km * 1.3; // 30% buffer for road trips
      if (ev.realWorldRange.mixed >= neededRange) {
        score += 50;
        reasons.push("Covers your daily commute with buffer for detours");
      } else if (ev.realWorldRange.mixed >= answers.km) {
        score += 30;
        reasons.push("Covers your daily commute but limited spare range");
      } else {
        score += 10;
        reasons.push("May not cover your full daily drive");
      }

      // Budget fit (30% weight)
      const budgetRanges: Record<string, [number, number]> = {
        u40: [0, 40000],
        "40-55": [40000, 55000],
        "55-75": [55000, 75000],
        o75: [75000, Infinity],
      };
      if (answers.budget) {
        const [min, max] = budgetRanges[answers.budget];
        if (ev.price >= min && ev.price <= max) {
          score += 30;
          reasons.push("Within your budget range");
        } else if (ev.price < min) {
          score += 20;
          reasons.push("Under budget — great value");
        } else {
          const over = ev.price - max;
          if (over < 10000) {
            score += 15;
            reasons.push(`Just ${over.toLocaleString()} over budget`);
          } else {
            score += 5;
            reasons.push(`Over budget by $${(over / 1000).toFixed(0)}k`);
          }
        }
      }

      // Charging fit (20% weight)
      if (answers.charge.includes("home")) {
        score += 10;
        reasons.push("Great for home charging");
      }
      if (answers.charge.includes("public") || answers.charge.includes("unsure")) {
        if (ev.charging.maxDC >= 150) {
          score += 10;
          reasons.push("Fast DC charging suited to public charging");
        }
      }
      if (answers.charge.includes("work")) {
        score += 5;
      }

      // Bonus: towing
      if (ev.towCapacity >= 1600) reasons.push("Capable of heavy towing");
      else if (ev.towCapacity > 0) reasons.push("Can tow light loads");

      // Bonus: seats
      if (ev.seats >= 7) reasons.push("7-seater available");
      else if (ev.seats >= 5) reasons.push("5-seater");

      return {
        ...ev,
        score,
        matchPercent: Math.min(99, Math.round((score / 100) * 100)),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}

export function getAllVehicles(): EV[] {
  return vehicles;
}
