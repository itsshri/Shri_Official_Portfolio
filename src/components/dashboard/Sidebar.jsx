import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Wrench, Briefcase, User, LogOut, ExternalLink, ChevronRight, Mail, Heart } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

const NAV_ITEMS = [
  { key: 'overview',    label: 'Overview',         icon: LayoutDashboard },
  { key: 'about',       label: 'About',             icon: User },
  { key: 'projects',    label: 'My Projects',          icon: FolderKanban },
  { key: 'skills',      label: 'My Skills',            icon: Wrench },
  { key: 'experience',  label: 'Education&Experience',        icon: Briefcase },
  { key: 'leads',       label: 'Leads',             icon: Mail },
  { key: 'likes',       label: 'Likes&Comments',  icon: Heart },
];

export default function Sidebar({ activePanel, setActivePanel }) {
  const { logout, data } = usePortfolio();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col bg-surface-100 border-r border-white/8">
      {/* Brand */}
      <div className="p-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-black shadow-glow-sm">
            S
          </div>
          <div>
            <div className="font-bold text-white">Creator's Panel</div>
            <div className="text-xs text-slate-500 font-mono">Portfolio</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activePanel === key;
          return (
            <button
              key={key}
              onClick={() => setActivePanel(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-500/15 text-white border border-primary-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'} />
              {label}
              {key === 'leads' && data.leads?.length > 0 && (
                <span className="ml-auto px-1.5 py-0.5 rounded-md bg-primary-500/20 text-primary-400 text-xs font-mono">
                  {data.leads.length}
                </span>
              )}
              {key === 'likes' && (() => {
                const total = Object.values(data.interactions || {}).reduce((s, v) => s + (v.likes || 0) + (v.comments || []).length, 0);
                return total > 0 ? (
                  <span className="ml-auto px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-xs font-mono">
                    {total}
                  </span>
                ) : null;
              })()}
              {isActive && key !== 'leads' && key !== 'likes' && <ChevronRight size={14} className="ml-auto text-primary-400" />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/8 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ExternalLink size={16} />
          View Live Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
