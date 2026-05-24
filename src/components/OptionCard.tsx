"use client";

import { Check } from "lucide-react";

interface OptionCardProps {
  emoji: string;
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionCard({
  emoji,
  label,
  sub,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-[14px_16px] rounded-[16px] border-2 text-left transition-all duration-150 ${
        selected
          ? "border-ink bg-green-light"
          : "border-border bg-surface-raised hover:border-ink/30"
      }`}
    >
      <span className="text-[26px] w-8 flex-shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm block">{label}</span>
        <span className="text-xs text-ink-secondary">{sub}</span>
      </div>
      <div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          selected ? "bg-ink border-ink" : "border-border"
        }`}
      >
        {selected && <Check className="w-4 h-4 text-white" />}
      </div>
    </button>
  );
}
