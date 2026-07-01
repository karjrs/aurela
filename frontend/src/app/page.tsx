import { ClosingStatement } from "@/components/landing/ClosingStatement";
import { DayMoments } from "@/components/landing/DayMoments";
import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[linear-gradient(to_bottom,var(--color-dawn-50),var(--color-mist-100)_20%,var(--color-gold-100)_40%,var(--color-coral-200)_60%,var(--color-lavender-300)_80%,var(--color-ink-900)_100%)]">
      <Hero />
      <DayMoments />
      <ClosingStatement />
    </div>
  );
}
