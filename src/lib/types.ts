export interface EV {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  bodyType: "sedan" | "suv" | "hatch" | "ute" | "wagon";
  price: number;
  priceNote: string;
  wlptRange: number;
  realWorldRange: {
    city: number;
    mixed: number;
    highway: number;
    towing: number;
  };
  charging: {
    port: string;
    maxAC: number;
    maxDC: number;
    batteryKwh: number;
  };
  seats: number;
  boot: number;
  towCapacity: number;
  groundClearance: number;
  drive: "FWD" | "RWD" | "AWD";
  url: string;
}

export type Screen =
  | "home"
  | "quiz-1"
  | "quiz-2"
  | "quiz-3"
  | "results"
  | "range"
  | "compare";

export type BudgetBucket = "u40" | "40-55" | "55-75" | "o75";
export type ChargeOption = "home" | "work" | "public" | "unsure";

export interface Answers {
  km: number;
  charge: ChargeOption[];
  budget: BudgetBucket | null;
}

export interface ScoredEV extends EV {
  score: number;
  matchPercent: number;
  reasons: string[];
}
