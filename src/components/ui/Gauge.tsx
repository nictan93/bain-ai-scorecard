"use client";

interface GaugeProps {
  /** 0–100 percentage */
  percent: number;
  /** Label shown below the gauge */
  label: string;
  /** Optional sub-label */
  subLabel?: string;
}

/**
 * Animated half-circle speedometer gauge.
 *
 * Uses pure CSS @keyframes animation — no JavaScript state needed.
 * The animation runs from -90deg (left) to the target angle on page load.
 * Works correctly inside Suspense boundaries and with SSR.
 *
 * Angle mapping: 0% → -90deg (left), 50% → 0deg (top), 100% → 90deg (right)
 *
 * Design token colours:
 *   0–25%  → #16A34A (state-success green)
 *  26–50%  → #CA8A04 (state-caution amber)
 *  51–75%  → #D97706 (state-warning orange)
 *  76–100% → #B91C1C (state-danger red)
 */
export function Gauge({ percent, label, subLabel }: GaugeProps) {
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const targetAngle = -90 + clampedPercent * 1.8;

  const cx = 160;
  const cy = 160;
  const r = 120;
  const needleLength = 86;
  const needleW = 5;

  function polarToCartesian(angleDeg: number, radius: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy - radius * Math.sin(rad) };
  }

  function arcPath(startDeg: number, endDeg: number) {
    const s = polarToCartesian(startDeg, r);
    const e = polarToCartesian(endDeg, r);
    return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
  }

  const zones = [
    { startDeg: 180, endDeg: 135, color: "#16A34A" },
    { startDeg: 135, endDeg: 90,  color: "#CA8A04" },
    { startDeg: 90,  endDeg: 45,  color: "#D97706" },
    { startDeg: 45,  endDeg: 0,   color: "#B91C1C" },
  ];

  function getColor(pct: number) {
    if (pct <= 25) return "#16A34A";
    if (pct <= 50) return "#CA8A04";
    if (pct <= 75) return "#D97706";
    return "#B91C1C";
  }

  const activeColor = getColor(clampedPercent);

  // Unique animation name based on target angle to avoid conflicts
  const animName = `gauge-sweep-${Math.round(targetAngle * 10)}`;

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <style>{`
        @keyframes ${animName} {
          from {
            transform: rotate(-90deg);
          }
          to {
            transform: rotate(${targetAngle}deg);
          }
        }
        .gauge-needle-${Math.round(targetAngle * 10)} {
          transform-box: fill-box;
          transform-origin: bottom center;
          transform: rotate(${targetAngle}deg);
          animation: ${animName} 0.9s cubic-bezier(0.3, 0, 0, 1) 0.3s both;
        }
      `}</style>

      <svg
        viewBox="55 55 210 125"
        className="w-full max-w-[300px]"
        aria-label={`Score gauge: ${label}`}
        role="img"
      >
        {/* Background arc */}
        <path
          d={arcPath(180, 0)}
          fill="none"
          stroke="#E4E2DC"
          strokeWidth={26}
          strokeLinecap="round"
        />

        {/* Coloured zone arcs */}
        {zones.map((zone) => (
          <path
            key={zone.color}
            d={arcPath(zone.startDeg, zone.endDeg)}
            fill="none"
            stroke={zone.color}
            strokeWidth={26}
            strokeLinecap="butt"
            opacity={0.9}
          />
        ))}

        {/* White inner cap */}
        <circle cx={cx} cy={cy} r={r - 26} fill="white" />

        {/* Zone divider ticks */}
        {[0, 45, 90, 135, 180].map((deg) => {
          const inner = polarToCartesian(deg, r - 36);
          const outer = polarToCartesian(deg, r + 2);
          return (
            <line
              key={deg}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke="#F7F5F2"
              strokeWidth={2.5}
            />
          );
        })}

        {/* Needle — pure CSS @keyframes animation */}
        <rect
          className={`gauge-needle-${Math.round(targetAngle * 10)}`}
          x={cx - needleW / 2}
          y={cy - needleLength}
          width={needleW}
          height={needleLength}
          rx={2.5}
          fill="#1A1A1A"
        />

        {/* Pivot circles */}
        <circle cx={cx} cy={cy} r={13} fill="#1A1A1A" />
        <circle cx={cx} cy={cy} r={5} fill="white" />
      </svg>

      <div className="text-center space-y-0.5">
        <p
          className="text-sm font-sans font-bold leading-tight"
          style={{ color: activeColor }}
        >
          {label}
        </p>
        {subLabel && (
          <p className="text-xs font-sans text-text-secondary">{subLabel}</p>
        )}
      </div>
    </div>
  );
}
