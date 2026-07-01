"use client";

import { useTranslations } from "next-intl";

const moments = [
  {
    key: "morning",
    labelClassName: "text-gold-700",
  },
  {
    key: "midday",
    labelClassName: "text-coral-700",
  },
  {
    key: "evening",
    labelClassName: "text-lavender-700",
  },
] as const;

export const DayMoments = () => {
  const t = useTranslations("DayMoments");

  return (
    <section className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-3 sm:gap-8">
      {moments.map((moment) => (
        <div key={moment.key} className="flex flex-col gap-3 text-center sm:text-left">
          <span
            className={`font-display text-sm tracking-wide italic ${moment.labelClassName}`}
          >
            {t(`${moment.key}Label`)}
          </span>
          <p className="text-lg leading-snug text-ink-800">
            {t(`${moment.key}Statement`)}
          </p>
        </div>
      ))}
    </section>
  );
};
