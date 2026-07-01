export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-6 pt-28 pb-20 text-center sm:pt-36 sm:pb-28">
      <div
        aria-hidden
        className="animate-glow-pulse motion-reduce:animate-none pointer-events-none absolute top-10 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-linear-to-r from-gold-300 to-coral-300 opacity-40 blur-3xl"
      />
      <h1 className="font-display relative max-w-3xl text-5xl leading-[1.1] font-medium text-ink-900 sm:text-6xl">
        Your day, quietly planned.
      </h1>
      <p className="relative max-w-xl text-lg leading-relaxed text-ink-600">
        Aurela turns your calendar and your to-dos into one simple rhythm —
        so you always know what&rsquo;s next, without the mental math.
      </p>
      <button
        type="button"
        className="relative rounded-full bg-coral-600 px-8 py-3 text-base font-medium text-dawn-50 transition-colors hover:bg-coral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-700"
      >
        Get started
      </button>
    </section>
  );
}
