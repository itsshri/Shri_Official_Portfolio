import { useRef, useEffect, useState } from 'react';
import { Github, ExternalLink, Play, ArrowRight, Star, Lock, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import VideoDialog from './VideoDialog.jsx';
import LikeCommentBar, { HeartBadge } from './LikeCommentBar.jsx';

/* ── Per-letter pop-in animator ────────────────────────────── */
function PopText({ text, className = '' }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            animation: `letterPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both`,
            animationDelay: `${i * 45}ms`,
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );
}

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

const BADGE_COLORS = {
  'Featured':   'bg-accent-500/20 text-accent-300 border-accent-400/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  'Full Stack': 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  'Frontend':   'bg-violet-500/15 text-violet-300 border-violet-500/30',
  'Backend':    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Mobile':     'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

function ProjectCard({ project, index, onWatchVideo }) {
  const { getInteraction } = usePortfolio();
  const [hovered, setHovered] = useState(false);
  const interaction = getInteraction('project', project.id);
  const isPatented = project.title?.toLowerCase().includes('nightsafe');

  return (
    <div
      className={`group relative flex flex-col rounded-3xl border bg-surface overflow-hidden transition-all duration-500 hover:-translate-y-2
        ${ isPatented
          ? 'border-amber-400/50 hover:border-amber-400/80 hover:shadow-[0_0_40px_rgba(251,191,36,0.25)]'
          : 'border-white/8 hover:border-primary-500/40 hover:shadow-card-hover'
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden bg-surface-200 flex-shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${['#6366f1','#8b5cf6','#10b981'][index % 3]} 0%, transparent 60%)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(45deg, rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(-45deg, rgba(99,102,241,0.5) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
            <div className="relative z-10 text-7xl font-black text-white/10 select-none font-mono">
              {project.number}
            </div>
          </div>
        )}

        {/* Badge — animated shimmer entrance + continuous pulse for Featured */}
        <div
          className={`absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-semibold border overflow-hidden
            ${BADGE_COLORS[project.badge] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}
          style={{
            animation: project.badge === 'Featured'
              ? 'badgeEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) both, badgePop 3.5s ease-in-out 1s infinite'
              : 'badgeEntrance 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both',
          }}
        >
          {project.badge === 'Featured' && (
            <>
              {/* Shimmer sweep overlay */}
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,220,100,0.35) 50%, transparent 60%)',
                  backgroundSize: '200% 100%',
                  animation: 'badgeShimmer 2.4s ease-in-out 2s infinite',
                }}
              />
              <span className="mr-1 relative z-10">✨</span>
            </>
          )}
          <span className="relative z-10">{project.badge}</span>
        </div>
        {/* ❤️ Heart badge sticker top-right */}
        <HeartBadge count={interaction.likes} />

        {/* 🔒 Patent overlay banner — NightSafe only */}
        {isPatented && (
          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-center pb-3 pt-2 z-20"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 60%, transparent)',
            }}
          >
            {/* Animated lock icon */}
            <div
              style={{
                animation: 'lockPulse 2.5s ease-in-out infinite',
                filter: 'drop-shadow(0 0 8px rgba(251,191,36,0.8))',
              }}
            >
              <Lock size={18} className="text-amber-400 mb-1" fill="rgba(251,191,36,0.15)" />
            </div>
            {/* Per-letter pop text */}
            <div className="text-xs font-black tracking-widest uppercase">
              <PopText
                text="Officially Patented"
                className="text-amber-400"
              />
            </div>
          </div>
        )}

        {/* Video play button overlay */}
        <button
          onClick={() => onWatchVideo(project)}
          className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:scale-110 transition-transform shadow-2xl">
            <Play size={24} className="text-white ml-1" fill="white" />
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-bold text-xl text-white mb-3 group-hover:text-primary-300 transition-colors leading-snug">
          {project.title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">
          {project.description}
        </p>

        {/* Tech */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech.map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {/* Links + Like/Comment */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                <Github size={16} /> Code
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                <ExternalLink size={16} /> Live
              </a>
            )}
          </div>
          <button onClick={() => onWatchVideo(project)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
            <Play size={12} fill="currentColor" /> Watch Demo
          </button>
        </div>

        {/* 🔒 Like + Comment bar */}
        <div className="mt-3 pt-3 border-t border-white/5">
          <LikeCommentBar
            itemType="project"
            itemId={project.id}
            title={project.title}
            section="Projects"
          />
        </div>
      </div>

      {/* 🔒 Patent rights footer — NightSafe only */}
      {isPatented && (
        <div
          className="flex items-center justify-center gap-2 py-2 text-center"
          style={{
            background: 'linear-gradient(90deg, rgba(251,191,36,0.05), rgba(251,191,36,0.12), rgba(251,191,36,0.05))',
            borderTop: '1px solid rgba(251,191,36,0.25)',
          }}
        >
          <ShieldCheck size={12} className="text-amber-400 flex-shrink-0" />
          <span
            className="text-amber-300/80 font-mono"
            style={{ fontSize: '10px', letterSpacing: '0.08em' }}
          >
            Rights Owned by Shrijith R
          </span>
          <Lock size={11} className="text-amber-400 flex-shrink-0" fill="rgba(251,191,36,0.2)" />
        </div>
      )}

      {/* Bottom glow on hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
        isPatented ? 'via-amber-400' : 'via-primary-500'
      } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
}

export default function Projects() {
  const { data } = usePortfolio();
  const [ref, inView] = useInView();
  const [videoProject, setVideoProject] = useState(null);

  return (
    <section id="projects" className="py-28 bg-surface" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`flex items-end justify-between mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div>
            <div className="section-label">// what i've built</div>
            <h2 className="section-title">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl">
              A selection of projects that reflect my skills across the full stack. Click the play button to watch a project demo.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 font-mono">
            <Star size={20} className="text-accent-400" fill="currentColor" />
            {data.projects.filter(p => p.featured).length} Featured
          </div>
        </div>

        {/* Projects grid — Featured first, then rest */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...data.projects]
            .sort((a, b) => {
              if (a.badge === 'Featured' && b.badge !== 'Featured') return -1;
              if (b.badge === 'Featured' && a.badge !== 'Featured') return 1;
              return 0;
            })
            .map((project, i) => (
            <div
              key={project.id}
              className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <ProjectCard
                project={project}
                index={i}
                onWatchVideo={setVideoProject}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-12 text-center transition-all duration-700 delay-500 ${inView ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href="https://github.com/itsshri"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <Github size={18} />
            View All on GitHub
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Video Modal */}
      {videoProject && (
        <VideoDialog project={videoProject} onClose={() => setVideoProject(null)} />
      )}
    </section>
  );
}
