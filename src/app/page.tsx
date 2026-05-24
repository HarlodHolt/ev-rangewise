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
      <div className="bg-ink text-white px-5 md:px-10 pb-10 md:pb-16">
        <StatusBar />
        <TopBar dark />

        <div className="hero-grid">
          <div className="mt-6 md:mt-10">
            <span className="tag tag-green text-xs">🇦🇺 BUILT FOR AUSTRALIA</span>
            <h1 className="text-[34px] md:text-[48px] font-bold leading-[1.08] mt-3 tracking-tight">
              The EV shortlist made for you.
            </h1>
            <p className="mt-2 text-base md:text-lg text-white/60 max-w-md">
              3 questions. Real Australian data. No sales spin, ever.
            </p>

            <Button
              onClick={() => router.push("/quiz")}
              className="w-full md:w-auto mt-6 md:mt-8 h-[54px] px-8 rounded-[20px] bg-green text-ink font-semibold text-[17px] shadow-[0_2px_12px_rgba(62,207,114,0.3)] hover:bg-green/90"
            >
              Get my shortlist — free →
            </Button>
            <p className="text-xs text-white/40 mt-2">
              No account needed · 200+ Australian-spec EVs
            </p>
          </div>

          {/* Teaser cards */}
          <div className="relative mt-8 md:mt-0 h-[200px] md:h-[280px] teaser-stack">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute left-0 right-0 bg-white/10 backdrop-blur-sm border border-white/10 rounded-[16px] p-4 md:p-6"
                style={{
                  bottom: `${i * 8}px`,
                  opacity: 1 - i * 0.3,
                  transform: `scale(${1 - i * 0.03})`,
                  zIndex: 2 - i,
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="micro-label text-white/40">#{i + 1}</span>
                    <p className="text-base md:text-lg font-medium mt-0.5">
                      {["Tesla Model Y", "BYD Atto 3", "MG ZS EV"][i]}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {["94% match", "88% match", "81% match"][i]}
                    </p>
                  </div>
                  <span className={`match-badge ${["match-badge-high", "match-badge-mid", "match-badge-low"][i]} text-xs`}>
                    {["94%", "88%", "81%"][i]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="micro-label text-white/35 text-center mt-2 md:mt-0">
          YOUR SHORTLIST WILL LOOK LIKE THIS
        </p>
      </div>

      {/* Trust strip */}
      <div className="bg-surface-raised border-b border-border">
        <div className="flex justify-center gap-6 md:gap-12 py-4 px-5 trust-strip">
          {["Free, always", "No sign-up", "2 min quiz"].map((item) => (
            <div key={item} className="flex items-center gap-1.5 text-sm text-ink">
              <span className="text-green-dark text-base">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How it works + More tools on desktop */}
      <div className="md:grid md:grid-cols-2 md:gap-12 md:px-10">
        {/* How it works */}
        <div className="px-5 md:px-0 py-8">
          <span className="micro-label text-ink-tertiary">HOW IT WORKS</span>
          <div className="mt-5 space-y-6">
            {[
              { num: 1, title: "Tell us how you drive", body: "Daily kms, charging, budget." },
              { num: 2, title: "We crunch the numbers", body: "Australian specs and pricing." },
              { num: 3, title: "Get your shortlist", body: "Ranked list with plain-English reasons." },
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
            className="w-full md:w-auto mt-8 h-[54px] px-8 rounded-[20px] bg-green text-ink font-semibold text-[17px] hover:bg-green/90"
          >
            Start the quiz →
          </Button>
        </div>

        {/* More tools */}
        <div className="px-5 md:px-0 pb-8 md:pt-8">
          <span className="micro-label text-ink-tertiary">MORE TOOLS</span>
          <div className="mt-4 grid grid-cols-2 gap-3 tools-grid">
            {tools.map((tool) => (
              <button
                key={tool.label}
                onClick={() => tool.href && router.push(tool.href)}
                className={`${tool.bg} rounded-[16px] p-5 text-left transition-transform active:scale-[0.97] hover:scale-[1.02]`}
              >
                <span className="text-2xl">{tool.emoji}</span>
                <p className="font-semibold text-sm mt-2">{tool.label}</p>
              </button>
            ))}
          </div>
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
      <div className="hidden md:block flex-1 text-center">
        <span className="text-sm">ev-rangewise.vercel.app</span>
      </div>
      <div className="w-[120px] h-[34px] rounded-b-[20px] bg-black/20 flex items-center justify-center md:hidden" />
      <div className="flex items-center gap-1 ml-auto">
        <span className="text-sm">●●●●○</span>
        <span className="text-sm">📶</span>
        <span className="text-sm">🔋</span>
      </div>
    </div>
  );
}
