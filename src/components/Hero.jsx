import { useState, useEffect, useRef, useMemo } from 'react';
import { Download, Github, Linkedin, Code2, Mail, Sparkles, MapPin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

/* ── Helpers ─────────────────────────────────────────────────── */
function parseStartYear(duration = '') {
  const match = duration.match(/(\d{4})/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
}

function polarToXY(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/* ── Typewriter ──────────────────────────────────────────────── */
const ROLES = ['Full Stack Developer','MERN Stack Developer', 'React Enthusiast', 'Spring Boot Engineer', 'Problem Solver', 'Analytics Strategist', 'UI Craftsman'];

function TypewriterText({ texts }) {
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const tRef = useRef(null);

  useEffect(() => {
    const current = texts[roleIndex];
    const speed = isDeleting ? 40 : 80;
    tRef.current = setTimeout(() => {
      if (!isDeleting && charIndex < current.length) { setDisplayText(current.slice(0, charIndex + 1)); setCharIndex(c => c + 1); }
      else if (isDeleting && charIndex > 0) { setDisplayText(current.slice(0, charIndex - 1)); setCharIndex(c => c - 1); }
      else if (!isDeleting && charIndex === current.length) { setTimeout(() => setIsDeleting(true), 1800); }
      else if (isDeleting && charIndex === 0) { setIsDeleting(false); setRoleIndex(i => (i + 1) % texts.length); }
    }, speed);
    return () => clearTimeout(tRef.current);
  }, [charIndex, isDeleting, roleIndex, texts]);

  return <span className="gradient-text typing-cursor">{displayText}</span>;
}

/* ── Dynamic Stats ───────────────────────────────────────────── */
function DynamicStats({ stats }) {
  const [start, setStart] = useState(0);
  const [fading, setFading] = useState(false);
  const perPage = 4;

  useEffect(() => {
    if (stats.length <= perPage) return;
    const iv = setInterval(() => {
      setFading(true);
      setTimeout(() => { setStart(p => (p + perPage) % stats.length); setFading(false); }, 400);
    }, 6000);
    return () => clearInterval(iv);
  }, [stats.length]);

  const visible = Array.from({ length: perPage }, (_, i) => stats[(start + i) % stats.length]);

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-8 transition-all duration-400 ${fading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
      {visible.map((stat, i) => (
        <div key={`${stat?.label}-${i}`} className="group">
          <div className="text-4xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">{stat?.number}</div>
          <div className="text-sm text-slate-500">{stat?.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Spider-Man Web ──────────────────────────────────────────── */

// Icon emoji by experience type
const TYPE_ICON = { education: '🎓', work: '💼', cert: '🏆' };
const TYPE_COLOR = {
  education: '#8b5cf6',
  work:      '#3b82f6',
  cert:      '#10b981',
};

// Slot positions for experience nodes arranged in a web pattern
const SLOTS = {
  education: [
    { r: 155, a: 310 },
    { r: 155, a: 340 },
    { r: 230, a: 320 },
    { r: 230, a: 300 },
  ],
  work: [
    { r: 155, a:  10 },
    { r: 155, a:  40 },
    { r: 230, a:  20 },
    { r: 230, a:  55 },
    { r: 310, a:  30 },
    { r: 310, a:  10 },
  ],
  cert: [
    { r: 155, a: 130 },
    { r: 155, a: 160 },
    { r: 230, a: 145 },
    { r: 230, a: 170 },
  ],
};

function SpiderWebJourney({ experiences }) {
  const [hoveredId, setHoveredId] = useState(null);
  const [appeared, setAppeared] = useState(false);

  useEffect(() => { const t = setTimeout(() => setAppeared(true), 300); return () => clearTimeout(t); }, []);

  // Web geometry
  const W = 760, H = 500;
  const CX = 250, CY = 330;  // center-left so journey flows left→right
  const RINGS  = [98, 155, 230, 440];
  const SPOKES = Array.from({ length: 12 }, (_, i) => i * 30);  // every 30°

  // Static landmark nodes (always rendered)
  const LANDMARKS = [
    { id: 'leetcode', label: 'LeetCode',    sub: '100+ Problems Solved', year: '2022', x: CX + 78 * Math.cos((200 - 90) * Math.PI / 180), y: CY + 78 * Math.sin((200 - 90) * Math.PI / 180), color: '#f59e0b', glow: '#f59e0b50', icon: '🧩', detail: 'Started DSA journey, mastered arrays, trees, graphs & DP' },
    { id: 'git',      label: 'Git & GitHub', sub: 'Version Control',     year: '2022', x: CX + 78 * Math.cos((290 - 90) * Math.PI / 180), y: CY + 78 * Math.sin((290 - 90) * Math.PI / 180), color: '#6366f1', glow: '#6366f150', icon: '🔀', detail: 'Open source collaboration, branching, CI/CD foundations' },
  ];

  // Cognizant is always the destination node (outermost right)
  const COGNIZANT = {
    id: 'cognizant', label: 'Cognizant Intern + FullTime Offer', sub: 'Technology Solutions', year: '2026',
    x: CX + 370, y: CY,
    color: '#06b6d4', glow: '#06b6d460', icon: '⭐',
    detail: 'Full Stack Developer |ㅤㅤㅤ Currently Working', isFinal: true,
  };

  // Build dynamic experience nodes from context
  const expNodes = useMemo(() => {
    const slotCounters = { education: 0, work: 0, cert: 0 };
    const sorted = [...experiences]
      .filter(e => !e.company.toLowerCase().includes('cognizant'))
      .sort((a, b) => parseStartYear(a.duration) - parseStartYear(b.duration));

    return sorted.map(exp => {
      const type = exp.type || 'work';
      const slots = SLOTS[type] || SLOTS.work;
      const idx = slotCounters[type] || 0;
      slotCounters[type] = idx + 1;
      const slot = slots[idx % slots.length];
      const pos = polarToXY(CX, CY, slot.r, slot.a);
      return {
        id: `exp-${exp.id}`,
        label: exp.company,
        sub: exp.role,
        year: parseStartYear(exp.duration).toString(),
        x: pos.x, y: pos.y,
        color: TYPE_COLOR[type] || '#3b82f6',
        glow: (TYPE_COLOR[type] || '#3b82f6') + '50',
        icon: TYPE_ICON[type] || '💼',
        detail: exp.bullets?.[0] || exp.role,
        type,
        exp,
      };
    });
  }, [experiences]);

  // All nodes
  const allNodes = [...LANDMARKS, ...expNodes, COGNIZANT];

  // Edges — connect chronologically: LeetCode/Git → exp nodes → Cognizant
  const edges = useMemo(() => {
    const list = [];
    const sorted = [...expNodes].sort((a, b) => parseInt(a.year) - parseInt(b.year));

    // Landmark cross-connections
    list.push({ from: 'leetcode', to: 'git' });

    if (sorted.length > 0) {
      list.push({ from: 'leetcode', to: sorted[0].id });
      list.push({ from: 'git',      to: sorted[0].id });
      for (let i = 0; i < sorted.length - 1; i++) {
        list.push({ from: sorted[i].id, to: sorted[i + 1].id });
      }
      list.push({ from: sorted[sorted.length - 1].id, to: 'cognizant' });
    } else {
      list.push({ from: 'leetcode', to: 'cognizant' });
      list.push({ from: 'git',      to: 'cognizant' });
    }
    // Extra web cross-links for visual richness
    sorted.forEach(n => {
      if (n.id !== sorted[sorted.length - 1]?.id) {
        list.push({ from: n.id, to: 'cognizant' });
      }
    });
    list.push({ from: 'leetcode', to: 'cognizant' });
    list.push({ from: 'git',      to: 'cognizant' });
    return list;
  }, [expNodes]);

  const nodeById = id => allNodes.find(n => n.id === id);

  const isEdgeHighlighted = (e) =>
    hoveredId && (e.from === hoveredId || e.to === hoveredId);

  const hoveredNode = hoveredId ? allNodes.find(n => n.id === hoveredId) : null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/8 mt-9px " style={{ height: '600px',width:'700px' ,background: '#020214' }}>

      {/* Background dot grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(100,160,255,0.9) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Blue radial glow at center */}
      <div className="absolute" style={{
        left: (CX / W * 100) + '%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 420, height: 490,
        background: 'radial-gradient(circle, rgba(30,60,180,0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* SVG web */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%" height="100%"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {allNodes.map(n => (
            <radialGradient key={`rg-${n.id}`} id={`rg-${n.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={n.color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <filter id="web-glow">
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Concentric web rings ── */}
        {RINGS.map((r, i) => (
          <circle key={r} cx={CX} cy={CY} r={r}
            fill="none"
            stroke={`rgba(140,180,255,${0.14 - i * 0.02})`}
            strokeWidth={0.8}
          />
        ))}

        {/* ── Radial spokes ── */}
        {SPOKES.map(angle => {
          const end = polarToXY(CX, CY, 430, angle);
          return (
            <line key={angle}
              x1={CX} y1={CY} x2={end.x} y2={end.y}
              stroke="rgba(140,180,255,0.07)"
              strokeWidth={0.5}
            />
          );
        })}

        {/* ── Edge connections ── */}
        {edges.map((edge, i) => {
          const from = nodeById(edge.from);
          const to = nodeById(edge.to);
          if (!from || !to) return null;
          const highlighted = isEdgeHighlighted(edge);
          const fromColor = from.color;
          const toColor = to.color;
          return (
            <line
              key={i}
              x1={from.x} y1={from.y}
              x2={to.x}   y2={to.y}
              stroke={highlighted ? fromColor : 'rgba(180,200,255,0.12)'}
              strokeWidth={highlighted ? 1.5 : 0.6}
              strokeDasharray={highlighted ? 'none' : '4 3'}
              filter={highlighted ? 'url(#web-glow)' : 'none'}
              style={{ transition: 'stroke 0.25s, stroke-width 0.25s' }}
            />
          );
        })}

        {/* ── Journey path (main flow line) ── */}
        {expNodes.length > 0 && (() => {
          const sorted = [...expNodes].sort((a, b) => parseInt(a.year) - parseInt(b.year));
          const pts = [LANDMARKS[0], ...sorted, COGNIZANT];
          const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
          return (
            <path d={d}
              fill="none"
              stroke="rgba(6,182,212,0.2)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />
          );
        })()}

        {/* ── Node glow halos ── */}
        {appeared && allNodes.map(node => (
          <circle key={`halo-${node.id}`}
            cx={node.x} cy={node.y}
            r={hoveredId === node.id ? 28 : 16}
            fill={`url(#rg-${node.id})`}
            style={{ transition: 'r 0.3s ease' }}
          />
        ))}

        {/* ── Node dots (SVG layer) ── */}
        {allNodes.map((node, i) => {
          const isHovered = hoveredId === node.id;
          const size = node.isFinal ? 22 : 18;
          const hSize = node.isFinal ? 26 : 22;
          const r = isHovered ? hSize : size;
          return (
            <circle
              key={`dot-${node.id}`}
              cx={node.x} cy={node.y} r={r}
              fill={`${node.color}22`}
              stroke={node.color}
              strokeWidth={node.isFinal ? 2.5 : 1.8}
              filter={isHovered ? 'url(#node-glow)' : 'none'}
              style={{
                transition: 'r 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                opacity: appeared ? 1 : 0,
                transitionDelay: `${i * 60}ms`,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredId(node.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          );
        })}
      </svg>

      {/* ── HTML node labels & emoji ── */}
      {allNodes.map((node, i) => {
        const isHovered = hoveredId === node.id;
        return (
          <div
            key={`label-${node.id}`}
            className="absolute flex flex-col items-center pointer-events-auto cursor-pointer"
            style={{
              left: (node.x / W * 100) + '%',
              top:  (node.y / H * 100) + '%',
              transform: 'translate(-50%,-50%)',
              zIndex: isHovered ? 30 : 10,
              opacity: appeared ? 1 : 0,
              transition: 'opacity 0.5s ease',
              transitionDelay: `${i * 60 + 100}ms`,
            }}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Emoji */}
            <div
              style={{
                fontSize: isHovered ? (node.isFinal ? '22px' : '18px') : (node.isFinal ? '18px' : '15px'),
                transition: 'font-size 0.2s',
                filter: `drop-shadow(0 0 6px ${node.color})`,
                lineHeight: 1,
              }}
            >
              {node.icon}
            </div>

            {/* Year badge */}
            <div
              className="absolute font-mono rounded px-1 py-px whitespace-nowrap"
              style={{
                top: '-18px',
                fontSize: '8px',
                background: `${node.color}20`,
                border: `1px solid ${node.color}50`,
                color: node.color,
              }}
            >
              {node.year}
            </div>

            {/* Name label below */}
            <div
              className="mt-1 text-center font-bold whitespace-nowrap"
              style={{
                fontSize: isHovered ? '10px' : '8px',
                color: isHovered ? node.color : 'rgba(200,210,255,0.7)',
                textShadow: isHovered ? `0 0 8px ${node.color}` : 'none',
                transition: 'all 0.2s',
                maxWidth: '90px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}

      {/* ── Hover detail card ── */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-40"
          style={{
            left: Math.min((hoveredNode.x / W * 100), 65) + '%',
            top:  Math.max(Math.min((hoveredNode.y / H * 160) - 5, 75), 5) + '%',
            transform: hoveredNode.x > W * 0.65 ? 'translate(-110%, -50%)' : 'translate(10%, -50%)',
          }}
        >
          <div
            className="w-56 rounded-2xl p-4 text-left"
            style={{
              background: 'rgba(5,7,30,0.95)',
              border: `1px solid ${hoveredNode.color}40`,
              boxShadow: `0 0 24px ${hoveredNode.glow}, 0 8px 32px rgba(0,0,0,0.6)`,
              backdropFilter: 'blur(16px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '18px' }}>{hoveredNode.icon}</span>
              <div>
                <div className="font-bold text-white text-sm leading-tight">{hoveredNode.label}</div>
                {hoveredNode.sub && <div className="text-xs font-mono" style={{ color: hoveredNode.color }}>{hoveredNode.sub}</div>}
              </div>
            </div>

            {/* Year + type */}
            <div className="flex items-center gap-2 mb-2">
              <div className="text-xs px-2 py-0.5 rounded-md font-mono"
                style={{ background: `${hoveredNode.color}15`, border: `1px solid ${hoveredNode.color}30`, color: hoveredNode.color }}>
                {hoveredNode.exp?.duration || hoveredNode.year}
              </div>
              {hoveredNode.exp?.location && (
                <div className="text-xs text-slate-500">📍 {hoveredNode.exp.location}</div>
              )}
            </div>

            {/* Detail */}
            <p className="text-xs text-slate-400 leading-relaxed">{hoveredNode.detail}</p>

            {/* Bullets from experience */}
            {hoveredNode.exp?.bullets?.slice(0, 2).map((b, bi) => (
              <div key={bi} className="mt-1.5 text-xs text-slate-500 flex items-start gap-1">
                <span style={{ color: hoveredNode.color, flexShrink: 0 }}>→</span>
                <span>{b}</span>
              </div>
            ))}

            {hoveredNode.isFinal && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs text-cyan-400 font-mono">My First Recognition</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Footer legend ── */}
      <div className="absolute bottom-3 left-4 flex items-center gap-3">
        {[
          { color: '#f59e0b', label: 'Skills' },
          { color: '#8b5cf6', label: 'Education' },
          { color: '#3b82f6', label: 'Work' },
          { color: '#10b981', label: 'Certs' },
          { color: '#06b6d4', label: 'Destination' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="text-xs text-slate-600">{label}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-3 right-3">
        <div className="text-xs font-mono text-slate-700 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>SPIDER-MAP v1.0</span>
        </div>
      </div>
    </div>
  );
}

/* ── Orbs / Particles ────────────────────────────────────────── */
function FloatingOrb({ className }) {
  return <div className={`absolute rounded-full filter blur-3xl opacity-20 animate-blob ${className}`} />;
}
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i, x: Math.random() * 100, y: Math.random() * 100,
  size: Math.random() * 3 + 1, delay: Math.random() * 4, duration: Math.random() * 4 + 4,
}));
function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map(p => (
        <div key={p.id} className="absolute rounded-full bg-primary-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite` }} />
      ))}
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
export default function Hero() {
  const { data } = usePortfolio();
  const { about, experience } = data;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-noise opacity-40" />
      <FloatingOrb className="w-[600px] h-[600px] bg-primary-600 -top-40 -right-40" />
      <FloatingOrb className="w-[400px] h-[400px] bg-violet-600 bottom-0 -left-20" />
      <FloatingOrb className="w-[300px] h-[300px] bg-accent-500 top-1/2 left-1/3" />
      <ParticleField />
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Left: Text */}
          <div>
            {/* Availability badge */}
            <div className={`inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full glass border border-primary-500/30 text-sm font-medium text-primary-300 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <Sparkles size={14} className="text-primary-400" />
              {about.availability}
            </div>

            {/* Photo + Name */}
            <div className={`flex items-center gap-5 mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {about.photo && (
                <div className="relative flex-shrink-0">
                  <img src={about.photo} alt={about.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-500/40 shadow-glow" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                </div>
              )}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-none tracking-tight">
                {about.name.split(' ')[0]}
                <br />
                <span className="text-slate-400 font-light text-4xl sm:text-5xl lg:text-6xl">
                  {about.name.split(' ').slice(1).join(' ')}
                </span>
              </h1>
            </div>

            {/* Typewriter */}
            <div className={`text-2xl sm:text-3xl font-semibold mb-5 h-10 flex items-center transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <TypewriterText texts={ROLES} />
            </div>

            <p className={`text-slate-400 text-base max-w-xl leading-relaxed mb-5 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {about.bio}
            </p>

            <div className={`flex items-center gap-2 text-slate-500 text-sm mb-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <MapPin size={14} />
              <span>{about.location}</span>
            </div>

            <div className={`flex flex-wrap gap-4 mb-8 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a href="Shri_Portfolio\Shri_Resume_Updated.pdf" download="Shrijith_Resume_Updated.pdf" className="btn-primary text-sm px-6 py-3">
                <Download size={16} /> Download Resume
              </a>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="btn-outline text-sm px-6 py-3">
                View My Work
              </button>
            </div>

            {/* Socials */}
            <div className={`flex items-center gap-3 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { icon: Github, href: about.github, label: 'GitHub' },
                { icon: Linkedin, href: about.linkedin, label: 'LinkedIn' },
                { icon: Code2, href: about.leetcode, label: 'LeetCode' },
                { icon: Mail, href: `mailto:${about.gmail}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer"
                  className="group flex items-center gap-2 px-3 py-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-primary-400/40 transition-all duration-200 hover:-translate-y-0.5" title={label}>
                  <Icon size={17} />
                  <span className="text-xs font-medium hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>

            {/* Dynamic Stats */}
            <div className={`mt-10 pt-8 border-t border-white/8 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <DynamicStats stats={about.stats} />
            </div>
          </div>

          {/* Right: Spider-Man Web */}
          <div className={`hidden lg:block transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                My journey Map
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>hover nodes to explore</span>
              </div>
            </div>
            <SpiderWebJourney experiences={experience || []} />
          </div>

        </div>
      </div>
    </section>
  );
}
