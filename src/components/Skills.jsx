import { useRef, useEffect, useState } from 'react';
import { Code2, Layout, Server, Database, Brain, Terminal, Zap } from 'lucide-react';
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

const ICON_MAP = {
  Code2, Layout, Server, Database, Brain, Terminal, Zap,
};

const GRADIENT_MAP = {
  'from-blue-500 to-cyan-500': { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  'from-violet-500 to-purple-500': { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  'from-green-500 to-emerald-500': { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  'from-orange-500 to-amber-500': { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  'from-pink-500 to-rose-500': { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  'from-yellow-500 to-orange-500': { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
};

// Map skill name → devicon class for logo
const DEVICON = {
  'React':        'devicon-react-original colored',
  'Next.js':      'devicon-nextjs-original',
  'Vue':          'devicon-vuejs-original colored',
  'TypeScript':   'devicon-typescript-original colored',
  'JavaScript':   'devicon-javascript-original colored',
  'Node.js':      'devicon-nodejs-original colored',
  'Express':      'devicon-express-original',
  'Spring Boot':  'devicon-spring-original colored',
  'Java':         'devicon-java-original colored',
  'Python':       'devicon-python-original colored',
  'MongoDB':      'devicon-mongodb-original colored',
  'MySQL':        'devicon-mysql-original colored',
  'PostgreSQL':   'devicon-postgresql-original colored',
  'Redis':        'devicon-redis-original colored',
  'Docker':       'devicon-docker-original colored',
  'Git':          'devicon-git-original colored',
  'GitHub':       'devicon-github-original',
  'Tailwind CSS': 'devicon-tailwindcss-original colored',
  'CSS':          'devicon-css3-original colored',
  'HTML':         'devicon-html5-original colored',
  'Figma':        'devicon-figma-original colored',
  'AWS':          'devicon-amazonwebservices-original colored',
  'Firebase':     'devicon-firebase-original colored',
  'GraphQL':      'devicon-graphql-plain colored',
  'C++':          'devicon-cplusplus-original colored',
  'C':            'devicon-c-original colored',
  'Linux':        'devicon-linux-original colored',
  'Kubernetes':   'devicon-kubernetes-plain colored',
  'Nginx':        'devicon-nginx-original colored',
  'Postman':      'devicon-postman-plain colored',
};

// Assign a color accent to each skill pill
const PILL_COLORS = [
  'from-blue-500/20 to-cyan-500/10   border-blue-500/25   text-blue-300',
  'from-violet-500/20 to-purple-500/10 border-violet-500/25 text-violet-300',
  'from-emerald-500/20 to-green-500/10 border-emerald-500/25 text-emerald-300',
  'from-amber-500/20 to-orange-500/10  border-amber-500/25  text-amber-300',
  'from-rose-500/20 to-pink-500/10     border-rose-500/25   text-rose-300',
  'from-cyan-500/20 to-teal-500/10     border-cyan-500/25   text-cyan-300',
];

function TechPill({ skill, colorIdx }) {
  const colors = PILL_COLORS[colorIdx % PILL_COLORS.length];
  const deviconClass = DEVICON[skill];
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl
        bg-gradient-to-r ${colors} border text-sm font-medium flex-shrink-0
        transition-all duration-200 hover:scale-105 hover:brightness-110 cursor-default`}
    >
      {deviconClass ? (
        <i className={`${deviconClass} text-base`} style={{ lineHeight: 1 }} />
      ) : (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: 'currentColor', opacity: 0.6 }}
        />
      )}
      {skill}
    </span>
  );
}

function TechCarouselRow({ skills, direction = 'left', speed = 30, colorOffset = 0 }) {
  const [paused, setPaused] = useState(false);
  // Double the list — scrollLeft/scrollRight keyframes animate -50% (one full copy)
  const items = [...skills, ...skills];
  const trackClass = direction === 'left' ? 'carousel-track carousel-track--left' : 'carousel-track carousel-track--right';

  return (
    <div
      className="overflow-hidden relative py-1"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left fade */}
      <div
        className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #16152a 30%, transparent)' }}
      />
      {/* Right fade */}
      <div
        className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #16152a 30%, transparent)' }}
      />

      <div
        className={trackClass}
        style={{
          gap: '12px',
          animationDuration: `${speed}s`,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {items.map((skill, i) => (
          <TechPill key={i} skill={skill} colorIdx={i + colorOffset} />
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { data, getInteraction } = usePortfolio();
  const [ref, inView] = useInView();
  const [hoveredId, setHoveredId] = useState(null);

  const allSkills = data.skills.flatMap(s => s.skills);

  return (
    <section id="skills" className="py-28 bg-surface-100" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-label">// what i work with</div>
          <h2 className="section-title mb-4">
            Technical <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A curated toolkit of technologies I use to build end-to-end applications — from database to deployment.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {data.skills.map((cat, i) => {
            const Icon = ICON_MAP[cat.icon] || Code2;
            const colors = GRADIENT_MAP[cat.color] || GRADIENT_MAP['from-blue-500 to-cyan-500'];
            const isHovered = hoveredId === cat.id;

            return (
              <div
                key={cat.id}
                className={`relative group p-6 rounded-2xl bg-surface border border-white/5 cursor-default transition-all duration-300 hover:border-white/15 hover:-translate-y-1 hover:shadow-card ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Top bar */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                    <Icon size={20} className={colors.text} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{cat.category}</h3>
                    <div className="text-xs text-slate-500 font-mono">{cat.skills.length} skills</div>
                  </div>
                </div>

                {/* Skill tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cat.skills.map(skill => (
                    <span
                      key={skill}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 ${
                        isHovered
                          ? `${colors.bg} ${colors.border} border ${colors.text}`
                          : 'bg-white/5 border border-white/8 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* ❤️ Heart badge sticker */}
                <HeartBadge count={getInteraction('skill', cat.id).likes} />

                {/* ❤️ Like + 💬 Comment bar */}
                <div className="pt-3 border-t border-white/5">
                  <LikeCommentBar
                    itemType="skill"
                    itemId={cat.id}
                    title={cat.category}
                    section="Technical Arsenal"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 🎠 Tech Carousel */}
        <div
          className={`transition-all duration-700 delay-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">All Technologies</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
            </div>
          </div>

          {/* 3 carousel rows — alternating directions */}
          <div className="space-y-3">
            <TechCarouselRow
              skills={allSkills}
              direction="left"
              speed={35}
              colorOffset={0}
            />
            <TechCarouselRow
              skills={[...allSkills].reverse()}
              direction="right"
              speed={28}
              colorOffset={2}
            />
            <TechCarouselRow
              skills={allSkills.filter((_, i) => i % 2 === 0)}
              direction="left"
              speed={42}
              colorOffset={4}
            />
          </div>

          <p className="text-center text-xs text-slate-700 font-mono mt-4">hover to pause</p>
        </div>
      </div>
    </section>
  );
}
