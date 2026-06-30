import { useRef, useEffect, useState } from 'react';
import { Briefcase, GraduationCap, Award, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import LikeCommentBar, { HeartBadge } from './LikeCommentBar.jsx';

function useInView(threshold = 0.1) {
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

const TYPE_CONFIG = {
  work: {
    icon: Briefcase,
    color: 'from-primary-500 to-violet-500',
    bg: 'bg-primary-500/15',
    border: 'border-primary-500/30',
    text: 'text-primary-400',
    label: 'Work',
  },
  education: {
    icon: GraduationCap,
    color: 'from-emerald-500 to-green-500',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    label: 'Education',
  },
  cert: {
    icon: Award,
    color: 'from-accent-500 to-orange-500',
    bg: 'bg-accent-500/15',
    border: 'border-accent-500/30',
    text: 'text-accent-400',
    label: 'Certification',
  },
};

export default function Experience() {
  const { data, getInteraction } = usePortfolio();
  const [ref, inView] = useInView();

  return (
    <section id="experience" className="py-28 bg-surface-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-label">// my journey</div>
          <h2 className="section-title">
            Experience &{' '}
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl">
            Where I've learned, built, and grown as a developer.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500/40 to-transparent" />

          <div className="space-y-10">
            {data.experience.map((exp, i) => {
              const config = TYPE_CONFIG[exp.type] || TYPE_CONFIG.work;
              const Icon = config.icon;

              return (
                <div
                  key={exp.id}
                  className={`relative flex gap-8 transition-all duration-700 ${
                    inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  {/* Timeline dot */}
                  <div className="relative flex-shrink-0 z-10">
                    <div className={`w-14 h-14 rounded-2xl border-2 ${config.border} flex items-center justify-center shadow-lg overflow-hidden ${exp.logo ? '' : config.bg}`}>
                      {exp.logo ? (
                        <img
                          src={exp.logo}
                          alt={exp.company}
                          className="w-full h-full object-cover"
                          style={{ display: 'block' }}
                        />
                      ) : (
                        <Icon size={24} className={config.text} />
                      )}
                    </div>
                    {/* Connector */}
                    {i < data.experience.length - 1 && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px h-10 bg-white/5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className={`group p-6 rounded-2xl bg-surface border border-white/5 hover:border-white/12 transition-all duration-300 hover:shadow-card`}>
                      {/* Meta row */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white group-hover:text-primary-200 transition-colors">
                            {exp.company}
                          </h3>
                          <p className={`text-sm font-medium mt-0.5 ${config.text}`}>{exp.role}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-surface-200 px-3 py-1.5 rounded-lg">
                            <Calendar size={11} />
                            {exp.duration}
                          </div>
                          {exp.location && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600">
                              <MapPin size={11} />
                              {exp.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bullets */}
                      <ul className="space-y-2.5">
                        {exp.bullets.map((bullet, bi) => (
                          <li key={bi} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed">
                            <ChevronRight size={14} className={`flex-shrink-0 mt-0.5 ${config.text}`} />
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      {/* Type badge + Like/Comment */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-mono ${config.text} ${config.bg} border ${config.border} px-2.5 py-1 rounded-lg`}>
                          <Icon size={11} />
                          {config.label}
                        </span>
                        <LikeCommentBar
                          itemType="experience"
                          itemId={exp.id}
                          title={exp.company}
                          section="Experience"
                        />
                      </div>

                      {/* ❤️ Heart badge sticker top-right */}
                      <HeartBadge count={getInteraction('experience', exp.id).likes} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
