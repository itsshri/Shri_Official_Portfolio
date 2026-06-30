import { useEffect, useState, useRef } from 'react';

// ── Enthusiasm-based trust scoring ────────────────────────────
// NOT spam detection. Measures how excited/enthusiastic the person
// is about Shrijith's work vs neutral or discouraging words.
export function computeTrustScore(name = '', subject = '', message = '') {
  const text = `${name} ${subject} ${message}`.toLowerCase();

  // Very enthusiastic / strongly encouraging words
  const HIGH_ENTHUSIASM = [
    'great work', 'great job', 'amazing work', 'love your', 'love the work',
    'impressed', 'impressive', 'excellent', 'brilliant', 'outstanding',
    'fantastic', 'wonderful', 'incredible', 'best portfolio', 'top notch',
    'glad to', 'excited to', 'looking forward', 'would love to work',
    'would love to collaborate', 'thrilled', 'blown away', 'exceptional',
    'phenomenal', 'superb', 'delighted', 'pleasure to', 'best work',
    'love what you', 'keep up the great', 'absolutely love', 'wow',
    'beautiful work', 'well done', 'great portfolio', 'happy to work',
    'highly skilled', 'very talented', 'really impressed', 'extremely impressed',
    'clean code', 'nicely done', 'awesome work', 'stellar',
    'we are glad', 'glad we found', 'perfect fit', 'exactly what we',
  ];

  // Simple / moderate interest — not super enthusiastic, just checking
  const MODERATE_INTEREST = [
    'interested', 'looking at your', 'checking out', 'came across',
    'found your', 'would like to know', 'want to discuss', 'considering',
    'might be', 'possibly', 'could be', 'let me know', 'saw your work',
    'nice work', 'good work', 'liked your', 'decent', 'pretty good',
    'reach out', 'like to connect', 'sounds good', 'seems good',
  ];

  // Non-encouraging / critical / dismissive words
  const LOW_ENTHUSIASM = [
    'improve', 'not nice', 'try better', 'needs improvement', 'disappointing',
    'not impressed', 'could be better', 'average', 'nothing special',
    'not great', 'mediocre', 'basic', 'simple design', 'just okay',
    'not bad but', 'not up to the mark', 'below average', 'poor',
    'not good enough', 'lacks', 'missing', 'weak', 'too simple',
  ];

  let score = 45; // neutral baseline

  HIGH_ENTHUSIASM.forEach(w   => { if (text.includes(w)) score += 14; });
  MODERATE_INTEREST.forEach(w => { if (text.includes(w)) score += 6; });
  LOW_ENTHUSIASM.forEach(w    => { if (text.includes(w)) score -= 18; });

  // Message length → more investment = higher enthusiasm
  const wordCount = message.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount >= 25) score += 10;
  else if (wordCount >= 12) score += 5;
  else if (wordCount < 5)  score -= 8;

  return Math.min(100, Math.max(0, Math.round(score)));
}

// Map score → named state
function getTrustState(score) {
  if (score >= 68) return 'high';
  if (score >= 40) return 'interest';
  return 'normal';
}

const CONFIG = {
  idle:     { label: 'Digital Iris Standby',      sub: 'Awaiting message input',                 color: '#475569' },
  scanning: { label: 'Iris Scanning...',           sub: 'Parsing sentiment & enthusiasm',          color: '#06b6d4' },
  high:     { label: 'HIGH TRUST',                 sub: 'Strong enthusiasm detected',              color: '#10b981' },
  interest: { label: 'JUST SHOWN INTEREST',        sub: 'Moderate interest, not fully committed',  color: '#3b82f6' },
  normal:   { label: 'NORMAL ENQUIRY',             sub: 'Neutral or non-encouraging tone',         color: '#94a3b8' },
};

function polarToCart(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startA, endA) {
  const s = polarToCart(cx, cy, r, startA);
  const e = polarToCart(cx, cy, r, endA);
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export default function TrustIris({ message = '', name = '', subject = '' }) {
  const [state, setState] = useState('idle');
  const [score, setScore] = useState(null);
  const [rot1, setRot1] = useState(0);
  const [rot2, setRot2] = useState(0);
  const animRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!message || message.trim().length < 8) {
      setState('idle'); setScore(null); return;
    }
    setState('scanning');
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const s = computeTrustScore(name, subject, message);
      setScore(s);
      setState(getTrustState(s));
    }, 2200);
    return () => clearTimeout(debounceRef.current);
  }, [message, name, subject]);

  useEffect(() => {
    cancelAnimationFrame(animRef.current);
    const speeds = { idle: [0, 0], scanning: [2.5, -1.8], high: [0.35, -0.2], interest: [0.9, -0.6], normal: [0.5, -0.35] };
    const [s1, s2] = speeds[state] || [0, 0];
    if (s1 === 0) return;
    const loop = () => { setRot1(r => r + s1); setRot2(r => r + s2); animRef.current = requestAnimationFrame(loop); };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [state]);

  const cfg = CONFIG[state];
  const { color } = cfg;
  const SIZE = 140;
  const cx = SIZE / 2, cy = SIZE / 2;
  const R_OUTER = 60, R_MID = 44, R_INNER = 28, R_CORE = 14;

  const outerCount = state === 'normal' ? 6 : 8;
  const outerGap   = state === 'normal' ? 15 : 6;
  const outerSeg   = 360 / outerCount;
  const midCount   = state === 'normal' ? 8 : 12;
  const midGap     = state === 'normal' ? 15 : 8;
  const midSeg     = 360 / midCount;

  const centerIcon = state === 'high' ? '⬡' : state === 'scanning' ? '◈' : state === 'interest' ? '◐' : '◯';

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} overflow="visible">
          <defs>
            <radialGradient id={`ig-${state}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.22" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <filter id="iris-glow-f">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Background glow */}
          <circle cx={cx} cy={cy} r={R_OUTER + 8} fill={`url(#ig-${state})`} />

          {/* Outer iris segments */}
          <g transform={`rotate(${rot1.toFixed(1)}, ${cx}, ${cy})`} filter="url(#iris-glow-f)">
            {Array.from({ length: outerCount }).map((_, i) => (
              <path key={i}
                d={arcPath(cx, cy, R_OUTER, i * outerSeg, i * outerSeg + outerSeg - outerGap)}
                fill="none" stroke={color}
                strokeWidth={state === 'high' ? '3.5' : '2.8'}
                strokeLinecap="round"
              />
            ))}
            {/* Tick marks */}
            {Array.from({ length: 24 }).map((_, i) => {
              const rad = ((i * 15) - 90) * Math.PI / 180;
              const r1 = R_OUTER + 3, r2 = R_OUTER + (i % 6 === 0 ? 9 : 5);
              return (
                <line key={i}
                  x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
                  x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
                  stroke={color} strokeWidth={i % 6 === 0 ? 1.5 : 0.7} opacity="0.45"
                />
              );
            })}
          </g>

          {/* Middle ring */}
          <g transform={`rotate(${rot2.toFixed(1)}, ${cx}, ${cy})`}>
            {Array.from({ length: midCount }).map((_, i) => (
              <path key={i}
                d={arcPath(cx, cy, R_MID, i * midSeg, i * midSeg + midSeg - midGap)}
                fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6"
              />
            ))}
          </g>

          {/* Inner ring */}
          <circle cx={cx} cy={cy} r={R_INNER} fill={`${color}15`} stroke={color} strokeWidth="1.5" />

          {/* Scan line */}
          {state === 'scanning' && (
            <g transform={`rotate(${rot1 * 3}, ${cx}, ${cy})`}>
              <line x1={cx} y1={cy} x2={cx} y2={cy - R_INNER + 2} stroke={color} strokeWidth="1.5" opacity="0.8" />
            </g>
          )}

          {/* Core */}
          <circle cx={cx} cy={cy} r={R_CORE} fill={`${color}20`} stroke={color} strokeWidth="1" />

          {/* Center icon */}
          <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
            fill={color} fontSize="14" fontFamily="system-ui, sans-serif">
            {centerIcon}
          </text>
        </svg>
      </div>

      {/* Labels */}
      <div className="text-center space-y-1">
        <div className="text-xs font-bold tracking-wider uppercase font-mono"
          style={{ color, textShadow: `0 0 8px ${color}60` }}>
          {cfg.label}
        </div>
        <div className="text-xs text-slate-500">{cfg.sub}</div>
        {score !== null && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="w-28 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
            </div>
            <span className="text-xs font-mono" style={{ color }}>{score}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
