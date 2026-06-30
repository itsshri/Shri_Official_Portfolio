import { useState } from 'react';
import { Heart, MessageCircle, Trash2, FolderKanban, Wrench, Briefcase, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import { computeTrustScore } from '../TrustIris.jsx';

const SECTION_ICON = {
  Projects:           FolderKanban,
  'Technical Arsenal': Wrench,
  Experience:         Briefcase,
};
const SECTION_COLOR = {
  Projects:           'text-primary-400 bg-primary-500/10 border-primary-500/20',
  'Technical Arsenal': 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  Experience:         'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

function InteractionCard({ itemKey, item, onDeleteComment }) {
  const [expanded, setExpanded] = useState(false);
  const SectionIcon = SECTION_ICON[item.section] || FolderKanban;
  const sectionColor = SECTION_COLOR[item.section] || SECTION_COLOR.Projects;

  return (
    <div className="rounded-2xl border border-white/8 bg-surface-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${sectionColor}`}>
          <SectionIcon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white truncate">{item.title}</div>
          <div className={`text-xs font-mono mt-0.5 ${sectionColor.split(' ')[0]}`}>{item.section}</div>
        </div>

        {/* Counts */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Heart size={15} className="text-red-400 fill-red-400" />
            <span className="text-sm font-bold text-white">{item.likes || 0}</span>
            <span className="text-xs text-slate-500">likes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle size={15} className="text-primary-400" />
            <span className="text-sm font-bold text-white">{(item.comments || []).length}</span>
            <span className="text-xs text-slate-500">comments</span>
          </div>
        </div>

        {(item.comments || []).length > 0 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors flex-shrink-0"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Comments expanded */}
      {expanded && (item.comments || []).length > 0 && (
        <div className="border-t border-white/5 px-5 pb-4 pt-3 space-y-3">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Comments</div>
          {item.comments.map(c => {
            const trust = computeTrustScore('', '', c.text);
            const trustColor = trust >= 68 ? 'text-emerald-400' : trust >= 40 ? 'text-blue-400' : 'text-slate-400';
            return (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-300 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.author?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white">{c.author}</span>
                    <span className="text-xs text-slate-600">{formatTime(c.time)}</span>
                    <span className={`text-xs font-mono ${trustColor}`}>· {trust}% enthusiasm</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">{c.text}</p>
                </div>
                <button
                  onClick={() => { if (window.confirm('Delete this comment?')) onDeleteComment(c.id); }}
                  className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LikesCommentsPanel() {
  const { data, deleteComment, resetLikes } = usePortfolio();
  const interactions = data.interactions || {};
  const [confirmReset, setConfirmReset] = useState(false);

  // Filter only items with at least 1 like or 1 comment
  const items = Object.entries(interactions)
    .filter(([, v]) => v.likes > 0 || (v.comments || []).length > 0)
    .sort((a, b) => {
      const aScore = (a[1].likes || 0) + (a[1].comments || []).length;
      const bScore = (b[1].likes || 0) + (b[1].comments || []).length;
      return bScore - aScore;
    });

  const totalLikes    = items.reduce((s, [, v]) => s + (v.likes || 0), 0);
  const totalComments = items.reduce((s, [, v]) => s + (v.comments || []).length, 0);

  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? items
    : filter === 'likes' ? items.filter(([, v]) => v.likes > 0)
    : items.filter(([, v]) => (v.comments || []).length > 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Heart size={20} className="text-red-400 fill-red-400" />
            Likes &amp; Comments
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Engagement from recruiters on your portfolio</p>
        </div>

        {/* Reset Likes button */}
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 border border-rose-500/30 bg-rose-500/8 hover:bg-rose-500/15 transition-colors"
          >
            <RotateCcw size={12} /> Reset Likes
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-400 font-mono">Reset all likes?</span>
            <button
              onClick={() => { resetLikes(); setConfirmReset(false); }}
              className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            >Yes, reset</button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/8 hover:bg-white/15 text-slate-300 transition-colors"
            >Cancel</button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-4 rounded-2xl bg-red-500/8 border border-red-500/20">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-red-400 fill-red-400" />
            <span className="text-2xl font-bold text-red-400">{totalLikes}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Total Likes</div>
        </div>
        <div className="p-4 rounded-2xl bg-primary-500/8 border border-primary-500/20">
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-primary-400" />
            <span className="text-2xl font-bold text-primary-400">{totalComments}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Total Comments</div>
        </div>
        <div className="p-4 rounded-2xl bg-violet-500/8 border border-violet-500/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <span className="text-2xl font-bold text-violet-400">{items.length}</span>
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Engaged Items</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5">
        {[{ key: 'all', label: 'All' }, { key: 'likes', label: '❤️ Likes' }, { key: 'comments', label: '💬 Comments' }].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filter === f.key
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-surface-300 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">❤️</div>
          <p className="text-slate-500 font-medium">No engagements yet</p>
          <p className="text-slate-600 text-sm mt-1">
            When recruiters like or comment on your projects, skills, or experience — they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(([key, item]) => {
            const [type, id] = key.split('_');
            return (
              <InteractionCard
                key={key}
                itemKey={key}
                item={item}
                onDeleteComment={(commentId) => deleteComment(type, id, commentId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
