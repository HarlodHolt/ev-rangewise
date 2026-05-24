"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";

const tools = [
  { emoji: "📍", label: "Range estimator", bg: "bg-blue/30", href: "/range" },
  { emoji: "↔", label: "Compare", bg: "bg-green-light", href: "/compare" },
  { emoji: "📰", label: "News", bg: "bg-yellow/50", href: null },
  { emoji: "📖", label: "EV 101", bg: "bg-red-light", href: null },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full">
      {/* Hero */}
      <div className="bg-ink text-white px-5 pb-10">
        <StatusBar />
        <TopBar dark />

        <div className="mt-6">
          <span className="tag tag-green text-xs">🇦🇺 BUILT FOR AUSTRALIA</span>
          <h1 className="text-[34px] font-bold leading-[1.12] mt-3 tracking-tight">
            The EV shortlist made for you.
          </h1>
          <p className="mt-2 text-base text-white/60">
            3 questions. Real Australian data. No sales spin, ever.
          </p>
        </div>

        {/* Teaser cards */}
        <div className="relative mt-8 h-[200px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-0 right-0 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[16px] p-4"
              style={{
                bottom: `${i * 7}px`,
                opacity: 1 - i * 0.3,
                transform: `scale(${1 - i * 0.03})`,
                zIndex: 2 - i,
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="micro-label text-white/40">#{i + 1}</span>
                  <p className="text-sm font-medium mt-0.5">Tesla Model Y</p>
                </div>
                <span className="match-badge match-badge-high text-xs">94%</span>
              </div>
            </div>
          ))}
        </div>

        <p className="micro-label text-white/35 text-center mt-2">
          YOUR SHORTLIST WILL LOOK LIKE THIS
        </p>

        <Button
          onClick={() => router.push("/quiz")}
          className="w-full mt-5 h-[54px] rounded-[20px] bg-green text-ink font-semibold text-[17px] shadow-[0_2px_12px_rgba(62,207,114,0.3)] hover:bg-green/90"
        >
          Get my shortlist — free →
        </Button>
        <p className="text-xs text-white/40 text-center mt-2">
          No account needed · 200+ Australian-spec EVs
        </p>
      </div>

      {/* Trust strip */}
      <div className="bg-surface-raised border-b border-border">
        <div className="flex justify-center gap-8 py-4 px-5">
          {["Free, always", "No sign-up", "2 min quiz"].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-sm text-ink">
              <span className="text-green-dark text-base">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="px-5 py-8">
        <span className="micro-label text-ink-tertiary">HOW IT WORKS</span>
        <div className="mt-5 space-y-6">
          {[
            { num: 1, title: "Tell us how you drive", body: "Daily kms, charging, budget." },
            { num: 2, title: "We crunch the numbers", body: "Australian specs and pricing." },
            {
              num: 3,
              title: "Get your shortlist",
              body: "Ranked list with plain-English reasons.",
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4">
              <span className="w-9 h-9 rounded-full bg-ink text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                {step.num}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-ink-secondary mt-0.5">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => router.push("/quiz")}
          className="w-full mt-8 h-[54px] rounded-[20px] bg-green text-ink font-semibold text-[17px] hover:bg-green/90"
        >
          Start the quiz →
        </Button>
      </div>

      {/* More tools */}
      <div className="px-5 pb-8">
        <span className="micro-label text-ink-tertiary">MORE TOOLS</span>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <button
              key={tool.label}
              onClick={() => tool.href && router.push(tool.href)}
              className={`${tool.bg} rounded-[16px] p-5 text-left transition-transform active:scale-[0.97]`}
            >
              <span className="text-2xl">{tool.emoji}</span>
              <p className="font-semibold text-sm mt-2">{tool.label}</p>
            </button>
          ))}
        </div>
      </div>

      <Drawer />
    </div>
  );
}

function StatusBar() {
  return (
    <div className="h-[50px] flex items-center justify-between text-xs font-medium text-white/70">
      <span>9:41</span>
      <div className="w-[120px] h-[34px] rounded-b-[20px] bg-black/20 flex items-center justify-center" />
      <div className="flex items-center gap-1">
        <span className="text-sm">●●●●○</span>
        <span className="text-sm">📶</span>
        <span className="text-sm">🔋</span>
      </div>
    </div>
  );
}
