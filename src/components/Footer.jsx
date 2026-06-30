import { Github, Linkedin, Code2, Mail, Heart } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

export default function Footer() {
  const { data } = usePortfolio();
  const { about } = data;

  return (
    <footer className="py-12 border-t border-white/5 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-glow-sm">
              S
            </div>
            <div>
              <div className="font-bold text-white">
                Shrijith<span className="text-primary-400">.R</span>
              </div>
              <div className="text-xs text-slate-600 font-mono">Full Stack Developer</div>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
         Designed & Built By {about.name}
          </p>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: about.github },
              { icon: Linkedin, href: about.linkedin },
              { icon: Code2, href: about.leetcode },
              { icon: Mail, href: `mailto:${about.email}` },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-surface-100 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-primary-400/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
