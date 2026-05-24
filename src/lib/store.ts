import { create } from "zustand";
import type { Screen, Answers, BudgetBucket, ChargeOption } from "./types";

interface AppState {
  screen: Screen;
  drawerOpen: boolean;
  answers: Answers;
  setScreen: (screen: Screen) => void;
  setDrawerOpen: (open: boolean) => void;
  toggleDrawer: () => void;
  setKm: (km: number) => void;
  toggleCharge: (opt: ChargeOption) => void;
  setBudget: (budget: BudgetBucket) => void;
  reset: () => void;
}

const defaultAnswers: Answers = {
  km: 45,
  charge: [],
  budget: null,
};

export const useStore = create<AppState>((set) => ({
  screen: "home",
  drawerOpen: false,
  answers: { ...defaultAnswers },

  setScreen: (screen) => set({ screen, drawerOpen: false }),

  setDrawerOpen: (open) => set({ drawerOpen: open }),

  toggleDrawer: () => set((s) => ({ drawerOpen: !s.drawerOpen })),

  setKm: (km) =>
    set((s) => ({ answers: { ...s.answers, km } })),

  toggleCharge: (opt) =>
    set((s) => {
      const charge = s.answers.charge.includes(opt)
        ? s.answers.charge.filter((c) => c !== opt)
        : [...s.answers.charge, opt];
      return { answers: { ...s.answers, charge } };
    }),

  setBudget: (budget) =>
    set((s) => ({ answers: { ...s.answers, budget } })),

  reset: () => set({ answers: { ...defaultAnswers }, screen: "home" }),
}));
