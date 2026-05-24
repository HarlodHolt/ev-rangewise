"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Drawer from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { EV } from "@/lib/types";
import evsData from "@/data/evs.json";

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [ev, setEv] = useState<EV | null>(null);
  const [similar, setSimilar] = useState<EV[]>([]);

  useEffect(() => {
    const vehicles = (evsData as { vehicles: EV[] }).vehicles;
    const found = vehicles.find((v) => v.id === id);
    setEv(found || null);

    if (found) {
      // Find similar vehicles (same body type, similar price range)
      const similarCars = vehicles
        .filter(
          (v) =>
            v.id !== found.id &&
            (v.bodyType === found.bodyType ||
              Math.abs(v.price - found.price) < 20000)
        )
        .slice(0, 3);
      setSimilar(similarCars);
    }
  }, [id]);

  if (!ev) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full px-5 py-32">
        <p className="text-ink-secondary">Vehicle not found</p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 rounded-[20px] bg-green text-ink font-semibold"
        >
          Back to home
        </Button>
      </div>
    );
  }

  const isTopPick = ev.realWorldRange.mixed >= 400 && ev.price <= 60000;
  const chargeTimeHome = Math.round(ev.charging.batteryKwh / ev.charging.maxAC);
  const chargeTimeDC10to80 = Math.round(ev.charging.batteryKwh / (ev.charging.maxDC * 0.6));
  const costPer100km = 4; // approx AUD for 15kWh/100km at $0.25/kWh

  return (
    <div className="flex flex-col min-h-full pb-8">
      <TopBar />
      <Drawer />

      {/* Hero section */}
      <div className="bg-ink text-white px-5 md:px-10 pb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-white/60 hover:text-white pt-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <div className="mt-4 md:flex md:gap-8 md:items-end">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isTopPick && (
                <span className="tag tag-green text-xs">★ TOP PICK</span>
              )}
              <span className="micro-label text-white/40">{ev.drive} · {ev.bodyType.toUpperCase()}</span>
            </div>
            <h1 className="text-[34px] md:text-[44px] font-bold mt-2 leading-tight">
              {ev.make} {ev.model}
            </h1>
            <p className="text-lg text-white/60">{ev.variant} · {ev.year}</p>
          </div>

          <div className="mt-4 md:mt-0 text-left md:text-right">
            <p className="text-3xl md:text-4xl font-bold">
              ${(ev.price / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-white/40">{ev.priceNote}</p>
          </div>
        </div>

        {/* Key stats row */}
        <div className="mt-6 grid grid-cols-3 gap-4 md:gap-8 bg-white/5 rounded-[16px] p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green">{ev.realWorldRange.mixed}</p>
            <p className="text-xs text-white/50">km real range</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{chargeTimeDC10to80} min</p>
            <p className="text-xs text-white/50">DC 10-80%</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">${costPer100km}</p>
            <p className="text-xs text-white/50">/100km running</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 md:px-10 max-w-4xl mx-auto w-full">
        {/* Car photo placeholder */}
        <div className="mt-6 h-[200px] md:h-[300px] rounded-[20px] bg-gradient-to-b from-[#f0f0ee] to-[#e4e4e1] flex items-center justify-center">
          <span className="micro-label text-ink-tertiary">{ev.make} {ev.model} — PHOTO</span>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Range breakdown */}
          <div>
            <h3 className="font-bold text-lg mb-3">Real-world range</h3>
            <div className="space-y-3">
              {([
                { label: "City driving", key: "city" as const, extra: "+30%" },
                { label: "Mixed driving", key: "mixed" as const, extra: "expected" },
                { label: "Highway", key: "highway" as const, extra: "-15%" },
                { label: "Towing", key: "towing" as const, extra: "-40%" },
              ]).map((r) => (
                <div key={r.key} className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-ink-tertiary">WLTP: {Math.round(ev.realWorldRange[r.key] * 1.2)}km · {r.extra}</p>
                  </div>
                  <span className="text-lg font-bold font-mono">{ev.realWorldRange[r.key]} km</span>
                </div>
              ))}
            </div>
          </div>

          {/* Charging */}
          <div>
            <h3 className="font-bold text-lg mb-3">Charging</h3>
            <div className="space-y-4">
              <div className="p-4 bg-surface-subtle rounded-[16px]">
                <p className="text-sm font-medium">Home charging (7kW wall box)</p>
                <p className="text-2xl font-bold mt-1">{chargeTimeHome} hours</p>
                <p className="text-xs text-ink-tertiary">0–100% · {ev.charging.maxAC}kW AC max</p>
              </div>
              <div className="p-4 bg-surface-subtle rounded-[16px]">
                <p className="text-sm font-medium">DC fast charging</p>
                <p className="text-2xl font-bold mt-1">{chargeTimeDC10to80} min</p>
                <p className="text-xs text-ink-tertiary">10–80% · {ev.charging.maxDC}kW DC max · {ev.charging.port}</p>
              </div>
              <div className="p-4 bg-surface-subtle rounded-[16px]">
                <p className="text-sm font-medium">Battery</p>
                <p className="text-2xl font-bold mt-1">{ev.charging.batteryKwh} kWh</p>
                <p className="text-xs text-ink-tertiary">Usable capacity estimate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full specs table */}
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-3">Full specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: "Body type", val: ev.bodyType.charAt(0).toUpperCase() + ev.bodyType.slice(1) },
              { label: "Drive", val: ev.drive },
              { label: "Seats", val: `${ev.seats}` },
              { label: "Boot space", val: `${ev.boot} L` },
              { label: "Towing capacity", val: ev.towCapacity > 0 ? `${ev.towCapacity} kg` : "Not rated" },
              { label: "Ground clearance", val: `${ev.groundClearance} mm` },
              { label: "Price (drive-away)", val: `$${(ev.price / 1000).toFixed(0)}k` },
              { label: "WLTP range", val: `${ev.wlptRange} km` },
            ].map((s) => (
              <div key={s.label} className="flex justify-between py-2 border-b border-border">
                <span className="text-sm text-ink-secondary">{s.label}</span>
                <span className="text-sm font-medium">{s.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Similar cars */}
        {similar.length > 0 && (
          <div className="mt-8">
            <h3 className="font-bold text-lg mb-3">You might also like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {similar.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/car/${s.id}`)}
                  className="p-4 bg-surface-raised border border-border rounded-[16px] text-left hover:border-ink/30 transition-colors"
                >
                  <p className="text-sm font-bold">{s.make} {s.model}</p>
                  <p className="text-xs text-ink-secondary">{s.variant}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs tag tag-green">{s.realWorldRange.mixed} km</span>
                    <span className="text-xs font-bold">${(s.price / 1000).toFixed(0)}k</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="mt-8 space-y-3">
          <Button className="w-full h-[54px] rounded-[20px] bg-green text-ink font-semibold text-[17px] hover:bg-green/90">
            🚗 Book a test drive
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push(`/compare`)}
            className="w-full h-[54px] rounded-[20px] bg-surface-subtle text-ink font-medium hover:bg-surface-subtle/80"
          >
            ↔ Compare with similar models
          </Button>
        </div>
      </div>
    </div>
  );
}
