export const ArcGradients = () => (
  <defs>
    <linearGradient id="dashboard-day-arc" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style={{ stopColor: "var(--color-coral-500)" }} />
      <stop offset="50%" style={{ stopColor: "var(--color-amber-400)" }} />
      <stop offset="100%" style={{ stopColor: "var(--color-coral-500)" }} />
    </linearGradient>
    <radialGradient id="dashboard-sun-glow">
      <stop
        offset="0%"
        style={{ stopColor: "var(--color-amber-400)", stopOpacity: 0.35 }}
      />
      <stop
        offset="100%"
        style={{ stopColor: "var(--color-amber-400)", stopOpacity: 0 }}
      />
    </radialGradient>
    <radialGradient id="dashboard-moon-glow">
      <stop
        offset="0%"
        style={{ stopColor: "var(--color-navy-300)", stopOpacity: 0.35 }}
      />
      <stop
        offset="100%"
        style={{ stopColor: "var(--color-navy-300)", stopOpacity: 0 }}
      />
    </radialGradient>
    <linearGradient id="dashboard-moon-fill" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style={{ stopColor: "var(--color-navy-400)" }} />
      <stop offset="100%" style={{ stopColor: "var(--color-navy-200)" }} />
    </linearGradient>
  </defs>
);
