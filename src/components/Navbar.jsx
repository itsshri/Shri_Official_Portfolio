import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, KeyRound } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { data } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Active section tracking
      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      let current = 'home';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-surface/90 backdrop-blur-2xl border-b border-white/8 shadow-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-4">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('#home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-primary-500/40 shadow-glow-sm group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                {data.about?.photo ? (
                  <img src={data.about.photo} alt="Shrijith" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                    S
                  </div>
                )}
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Shrijith<span className="text-primary-400"> .R</span>
              </span>
            </button>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map(({ label, href }) => {
                const id = href.replace('#', '');
                const isActive = activeSection === id;
                return (
                  <li key={label}>
                    <button
                      onClick={() => handleNavClick(href)}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-white bg-white/8'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-400" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Hidden Creator Login icon */}

              {/* CTA */}
              <button
                onClick={() => handleNavClick('#contact')}
                className="hidden md:flex btn-primary text-sm px-5 py-2.5"
              >
                Let's Talk
              </button>

              <button
                onClick={() => navigate('/login')}
                
              >
                <KeyRound size={16} />
              </button>
              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-surface-100 border-l border-white/8 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <ul className="flex flex-col gap-2">
              {navItems.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => handleNavClick(href)}
                    className="w-full text-left px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 font-medium transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="pt-4">
                <button
                  onClick={() => { setMenuOpen(false); handleNavClick('#contact'); }}
                  className="btn-primary w-full justify-center"
                >
                  Let's Talk
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
