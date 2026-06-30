import { useRef, useEffect, useState } from 'react';
import { GraduationCap, MapPin, CheckCircle2, Code2, Cpu, Zap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const HIGHLIGHT_ICONS = {
  'Full Stack Development': Code2,
  'Data Analytics': Zap,
  'Cloud Computing': Zap,
  'REST API Design': Code2,
};

export default function About() {
  const { data } = usePortfolio();
  const { about } = data;
  const [ref, inView] = useInView();

  return (
    <section id="about" className="py-28 bg-surface" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-label">// who i am</div>
          <h2 className="section-title">
            A developer who codes{' '}
            <span className="gradient-text">with purpose</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Visual */}
          <div className={`transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Photo / Avatar card */}
            <div className="relative">
              <div className="relative w-full aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden border border-white/10 shadow-card">
                {about.photo ? (
                  <img
                    src={about.photo}
                    alt={about.name}
                    className="w-full h-full object-cover"
                    style={{ display: 'block' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-200 to-surface-300 flex items-center justify-center relative">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-5xl font-bold text-white shadow-glow">
                        S
                      </div>
                      <div className="text-slate-400 font-medium">{about.name}</div>
                    </div>
                  </div>
                )}
                {/* Overlay gradient only when no photo */}
                {!about.photo && (
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                )}
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 glass px-4 py-3 rounded-2xl border border-emerald-500/30 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-emerald-400">Open to Work</span>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass px-4 py-3 rounded-2xl border border-primary-500/30 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-primary-300">
                  <MapPin size={14} />
                  {about.location}
                </div>
              </div>

              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-3xl border border-primary-500/10 pointer-events-none" />
              <div className="absolute -inset-8 rounded-3xl border border-primary-500/5 pointer-events-none" />
            </div>
          </div>

          {/* Right — Text content */}
          <div className={`space-y-6 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Hi, I'm <span className="gradient-text">{about.name}</span>
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">{about.bio}</p>
              <p className="text-slate-400 leading-relaxed">{about.bio2}</p>
            </div>

            {/* Highlights grid */}
            <div>
              <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-4 font-mono">
                What I bring
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {about.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-100 border border-white/5 hover:border-primary-500/30 transition-colors group"
                  >
                    <CheckCircle2 size={16} className="text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Education card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/5 border border-primary-500/20">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <GraduationCap size={20} className="text-primary-400" />
                </div>
                <div>
                  <div className="font-semibold text-white">{about.education}</div>
                  <div className="text-sm text-primary-300 mt-1">{about.college}</div>
                  <div className="text-xs text-slate-500 mt-1 font-mono">{about.eduYear}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
