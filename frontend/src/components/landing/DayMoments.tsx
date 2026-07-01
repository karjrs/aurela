const moments = [
  {
    time: "Morning",
    labelClassName: "text-gold-700",
    statement: "Start with a plan that already makes sense.",
  },
  {
    time: "Midday",
    labelClassName: "text-coral-700",
    statement: "When things change, Aurela adjusts with you.",
  },
  {
    time: "Evening",
    labelClassName: "text-lavender-700",
    statement: "Close the day. Tomorrow's already taking shape.",
  },
];

export function DayMoments() {
  return (
    <section className="mx-auto grid max-w-4xl grid-cols-1 gap-12 px-6 py-20 sm:grid-cols-3 sm:gap-8">
      {moments.map((moment) => (
        <div key={moment.time} className="flex flex-col gap-3 text-center sm:text-left">
          <span
            className={`font-display text-sm tracking-wide italic ${moment.labelClassName}`}
          >
            {moment.time}
          </span>
          <p className="text-lg leading-snug text-ink-800">{moment.statement}</p>
        </div>
      ))}
    </section>
  );
}
