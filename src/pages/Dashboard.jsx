import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Sidebar from '../components/dashboard/Sidebar.jsx';
import ProjectsPanel from '../components/dashboard/ProjectsPanel.jsx';
import SkillsPanel from '../components/dashboard/SkillsPanel.jsx';
import ExperiencePanel from '../components/dashboard/ExperiencePanel.jsx';
import AboutPanel from '../components/dashboard/AboutPanel.jsx';
import LeadsPanel from '../components/dashboard/LeadsPanel.jsx';
import LikesCommentsPanel from '../components/dashboard/LikesCommentsPanel.jsx';
import {
  FolderKanban, Wrench, Briefcase, User, Activity,
  TrendingUp, Eye, RefreshCw, Layers, Mail
} from 'lucide-react';

function OverviewPanel({ data, setActivePanel }) {
  const stats = [
    { label: 'Projects',         count: data.projects.length,                                      icon: FolderKanban, color: 'text-primary-400 bg-primary-500/10 border-primary-500/20',  panel: 'projects' },
    { label: 'Skill Categories', count: data.skills.length,                                        icon: Wrench,       color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',    panel: 'skills' },
    { label: 'Total Skills',     count: data.skills.reduce((a, s) => a + s.skills.length, 0),      icon: Layers,       color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', panel: 'skills' },
    { label: 'Experience',       count: data.experience.length,                                    icon: Briefcase,    color: 'text-accent-400 bg-accent-500/10 border-accent-500/20',    panel: 'experience' },
    { label: 'Leads / Messages', count: (data.leads || []).length,                                 icon: Mail,         color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',          panel: 'leads' },
  ];

  const quickActions = [
    { label: 'Add Project',        icon: FolderKanban, panel: 'projects',    color: 'from-primary-600 to-violet-600' },
    { label: 'Edit Skills',        icon: Wrench,       panel: 'skills',      color: 'from-violet-600 to-purple-600' },
    { label: 'Update Experience',  icon: Briefcase,    panel: 'experience',  color: 'from-emerald-600 to-green-600' },
    { label: 'Edit About',         icon: User,         panel: 'about',       color: 'from-accent-600 to-orange-600' },
    { label: 'View Leads',         icon: Mail,         panel: 'leads',       color: 'from-cyan-600 to-blue-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600/20 to-violet-600/10 border border-primary-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary-500/5 filter blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-glow">
              S
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, Shrijith!</h1>
              <p className="text-slate-400 text-sm">Manage your portfolio content from here.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <Activity size={14} />
            All changes reflect instantly on your live portfolio
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(({ label, count, icon: Icon, color, panel }) => (
          <button
            key={label}
            onClick={() => setActivePanel(panel)}
            className="group p-5 rounded-2xl bg-surface-200 border border-white/5 hover:border-white/12 transition-all duration-200 text-left hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl ${color} border flex items-center justify-center mb-3`}>
              <Icon size={18} className={color.split(' ')[0]} />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{count}</div>
            <div className="text-sm text-slate-500">{label}</div>
          </button>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, panel, color }) => (
            <button
              key={label}
              onClick={() => setActivePanel(panel)}
              className={`flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${color} text-white font-medium text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent projects */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono mb-4">Recent Projects</h2>
        <div className="space-y-3">
          {data.projects.slice(0, 3).map(p => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-200 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-surface-300 flex-shrink-0 overflow-hidden">
                {p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-sm">{p.number}</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{p.title}</div>
                <div className="text-xs text-slate-500 font-mono">{p.tech.slice(0, 3).join(' · ')}</div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-400 border border-primary-500/20 font-mono flex-shrink-0">{p.badge}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data } = usePortfolio();
  const [activePanel, setActivePanel] = useState('overview');

  const panels = {
    overview:   <OverviewPanel data={data} setActivePanel={setActivePanel} />,
    about:      <AboutPanel />,
    projects:   <ProjectsPanel />,
    skills:     <SkillsPanel />,
    experience: <ExperiencePanel />,
    leads:      <LeadsPanel />,
    likes:      <LikesCommentsPanel />,
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar activePanel={activePanel} setActivePanel={setActivePanel} />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {panels[activePanel]}
        </div>
      </main>
    </div>
  );
}
