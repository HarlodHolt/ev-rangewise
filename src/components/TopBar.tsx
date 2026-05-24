"use client";

import { useStore } from "@/lib/store";

export default function TopBar({ dark = false }: { dark?: boolean }) {
  const toggleDrawer = useStore((s) => s.toggleDrawer);

  return (
    <header
      className={`flex items-center justify-between h-14 px-5 ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-lg tracking-tight">
          <span className={dark ? "text-white" : ""}>EV</span>
          <span className="text-green mx-px"> RangeWise</span>
        </span>
      </div>
      <button
        onClick={toggleDrawer}
        className="flex flex-col items-end gap-[3px] p-2"
        aria-label="Open menu"
      >
        <span
          className={`block h-0.5 w-[18px] rounded-full transition-colors ${
            dark ? "bg-white" : "bg-ink"
          }`}
        />
        <span
          className={`block h-0.5 w-[14px] rounded-full transition-colors ${
            dark ? "bg-white" : "bg-ink"
          }`}
        />
        <span
          className={`block h-0.5 w-[10px] rounded-full transition-colors ${
            dark ? "bg-white" : "bg-ink"
          }`}
        />
      </button>
    </header>
  );
}
