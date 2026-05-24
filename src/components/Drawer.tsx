"use client";

import { useStore } from "@/lib/store";
import { X } from "lucide-react";

const menuItems = [
  { emoji: "🔍", label: "Find my EV", sub: "The 3-question quiz", screen: "quiz-1" as const },
  { emoji: "📍", label: "Range estimator", sub: "Trip planner by car", screen: "range" as const },
  { emoji: "↔", label: "Compare models", sub: "Side-by-side specs", screen: "compare" as const },
  { emoji: "📰", label: "News & reviews", sub: "Coming soon", screen: null },
  { emoji: "📖", label: "EV 101", sub: "Coming soon", screen: null },
  { emoji: "🚗", label: "Book a test drive", sub: "Coming soon", screen: null },
];

export default function Drawer() {
  const { drawerOpen, setDrawerOpen, setScreen } = useStore();

  return (
    <>
      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[82%] bg-surface-raised rounded-l-[44px] shadow-lg transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-[105%]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <span className="font-bold text-lg tracking-tight">
            <span>EV</span>
            <span className="text-green mx-px"> RangeWise</span>
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-subtle"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="px-4 flex flex-col gap-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.screen) setScreen(item.screen);
                else setDrawerOpen(false);
              }}
              className="flex items-center gap-3 px-3 py-[14px] border-b border-border last:border-0 text-left w-full"
            >
              <span className="text-2xl w-8">{item.emoji}</span>
              <div className="flex-1">
                <span className="font-medium text-sm block">{item.label}</span>
                <span className="text-xs text-ink-tertiary">{item.sub}</span>
              </div>
              <svg
                className="w-4 h-4 text-ink-tertiary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-xs text-ink-tertiary text-center leading-relaxed">
            RangeWise is independent — we don't take money from car makers.
          </p>
        </div>
      </div>
    </>
  );
}
