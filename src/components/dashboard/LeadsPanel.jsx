import { useState } from 'react';
import {
  Trash2, Reply, ExternalLink, Cpu, Mail, Clock,
  MessageSquare, ChevronDown, ChevronUp, ThumbsUp, Search, Minus
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';
import TrustIris, { computeTrustScore } from '../TrustIris.jsx';

/* ── Trust level helper ─────────────────────────────────────── */
function getTrustLevel(score) {
  if (score === null || score === undefined) {
    return {
      key: 'unknown',
      label: 'Unknown',
      color: '#64748b',
      textClass: 'text-slate-400',
      bgClass: 'bg-slate-400/10',
      borderClass: 'border-slate-400/20',
      cardBorder: 'border-white/8',
      icon: Minus,
    };
  }
  if (score >= 68) return {
    key: 'high',
    label: 'High Trust',
    color: '#10b981',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/10',
    borderClass: 'border-emerald-400/25',
    cardBorder: 'border-emerald-500/20',
    icon: ThumbsUp,
  };
  if (score >= 40) return {
    key: 'interest',
    label: 'Just Shown Interest',
    color: '#3b82f6',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-400/10',
    borderClass: 'border-blue-400/25',
    cardBorder: 'border-blue-500/15',
    icon: Search,
  };
  return {
    key: 'normal',
    label: 'Normal Enquiry',
    color: '#94a3b8',
    textClass: 'text-slate-400',
    bgClass: 'bg-slate-400/10',
    borderClass: 'border-slate-400/20',
    cardBorder: 'border-white/8',
    icon: Minus,
  };
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}

/* ── Single Lead Card ───────────────────────────────────────── */
function LeadCard({ lead, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  // Always recompute live from message text so badge = iris (never stale localStorage score)
  const liveScore = computeTrustScore(lead.name || '', lead.subject || '', lead.message || '');
  const trust = getTrustLevel(liveScore);
  const TrustIcon = trust.icon;

  const handleReply = () => {
    const subject = encodeURIComponent(`Re: ${lead.subject}`);
    const body = encodeURIComponent(
      `Hi ${lead.name},\n\nThank you for reaching out!\n\n---\nOriginal message:\n"${lead.message}"\n\nBest regards,\nShrijith R`
    );
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(lead.email)}&su=${subject}&body=${body}`,
      '_blank'
    );
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 bg-surface-200 ${trust.cardBorder}`}>

      {/* ── Header row ── */}
      <div className="flex items-center gap-4 p-5">
        {/* Avatar circle */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg ${trust.bgClass} border ${trust.borderClass}`}
          style={{ color: trust.color }}
        >
          {lead.name?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{lead.name}</span>
            {/* Trust badge */}
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg font-mono ${trust.bgClass} ${trust.textClass} border ${trust.borderClass}`}>
              <TrustIcon size={10} />
              {trust.label}
              <span className="opacity-70">· {liveScore}%</span>
            </span>
          </div>
          <div className="text-sm text-slate-300 font-medium mt-0.5 truncate">{lead.subject}</div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1"><Mail size={10} />{lead.email}</span>
            <span className="flex items-center gap-1"><Clock size={10} />{formatDate(lead.receivedAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReply}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 text-xs font-medium transition-colors"
            title="Reply via Gmail"
          >
            <Reply size={14} /> Reply <ExternalLink size={10} />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => { if (window.confirm(`Delete lead from ${lead.name}?`)) onDelete(lead.id); }}
            className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Expanded detail: message + iris ── */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5">
          <div className="grid md:grid-cols-3 gap-6 pt-4">

            {/* Message */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
                <MessageSquare size={11} /> Full Message
              </div>
              <div className="p-4 rounded-xl bg-surface-300 border border-white/5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {lead.message}
              </div>
            </div>

            {/* Digital Iris + breakdown */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
                <Cpu size={11} /> Digital Iris
              </div>
              <TrustIris
                message={lead.message}
                name={lead.name}
                subject={lead.subject}
              />

              {/* Breakdown table */}
              <div className="mt-4 w-full space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-500">Enthusiasm</span>
                  <span style={{ color: trust.color }}>{liveScore}%</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-500">Word Count</span>
                  <span className="text-slate-400">
                    {lead.message?.trim().split(/\s+/).filter(Boolean).length ?? 0} words
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Classification</span>
                  <span className={trust.textClass}>{trust.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Leads Panel ────────────────────────────────────────────── */
export default function LeadsPanel() {
  const { data, deleteLead } = usePortfolio();
  const leads = data.leads || [];
  const [filter, setFilter] = useState('all');

  // Recompute scores live for every lead (ensures filters match badges)
  const scoredLeads = leads.map(l => ({
    ...l,
    _live: computeTrustScore(l.name || '', l.subject || '', l.message || ''),
  }));

  const highCount     = scoredLeads.filter(l => l._live >= 68).length;
  const interestCount = scoredLeads.filter(l => l._live >= 40 && l._live < 68).length;
  const normalCount   = scoredLeads.filter(l => l._live < 40).length;

  const filtered =
    filter === 'high'     ? scoredLeads.filter(l => l._live >= 68) :
    filter === 'interest' ? scoredLeads.filter(l => l._live >= 40 && l._live < 68) :
    filter === 'normal'   ? scoredLeads.filter(l => l._live < 40) :
    scoredLeads;

  const STATS = [
    { key: 'high',     label: 'High Trust',          count: highCount,     color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: ThumbsUp },
    { key: 'interest', label: 'Just Shown Interest',  count: interestCount, color: '#3b82f6', bg: 'bg-blue-500/10',    border: 'border-blue-500/20',    text: 'text-blue-400',    icon: Search },
    { key: 'normal',   label: 'Normal Enquiry',       count: normalCount,   color: '#94a3b8', bg: 'bg-slate-500/10',  border: 'border-slate-500/20',   text: 'text-slate-400',   icon: Minus },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail size={20} className="text-primary-400" />
            Leads Inbox
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {leads.length} message{leads.length !== 1 ? 's' : ''} received
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-600">
          <Cpu size={12} className="text-cyan-500" />
          AI Enthusiasm Scoring
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {STATS.map(({ key, label, count, bg, border, text, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(f => f === key ? 'all' : key)}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${bg} ${border} ${filter === key ? 'ring-1 ring-white/20' : ''}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon size={14} className={text} />
              <span className={`text-2xl font-bold ${text}`}>{count}</span>
            </div>
            <div className="text-xs text-slate-500 leading-tight">{label}</div>
          </button>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{ key: 'all', label: 'All' }, ...STATS.map(s => ({ key: s.key, label: s.label }))].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
              filter === key
                ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                : 'bg-surface-300 text-slate-500 border border-white/5 hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-200 border border-white/5 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-slate-600" />
          </div>
          <p className="text-slate-500 font-medium">No leads yet</p>
          <p className="text-slate-600 text-sm mt-1">
            Messages from your contact form will appear here with AI classification
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => (
            <LeadCard key={lead.id} lead={lead} onDelete={deleteLead} />
          ))}
        </div>
      )}
    </div>
  );
}
