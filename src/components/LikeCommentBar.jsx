import { useState, useCallback } from 'react';
import { Heart, MessageCircle, X, Send } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';

/* ── Flying heart particle ─────────────────────────────────── */
function FlyingHeart({ id, onDone }) {
  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        left: '50%',
        bottom: '100%',
        transform: 'translateX(-50%)',
        animation: 'heartFly 900ms ease-out forwards',
        fontSize: '22px',
        zIndex: 50,
      }}
      onAnimationEnd={onDone}
    >
      ❤️
    </div>
  );
}

/* ── Like + heart badge corner sticker ─────────────────────── */
export function HeartBadge({ count }) {
  if (!count) return null;
  return (
    <div
      className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2 py-1 rounded-full"
      style={{
        background: 'rgba(239,68,68,0.15)',
        border: '1px solid rgba(239,68,68,0.35)',
        backdropFilter: 'blur(8px)',
        animation: count === 1 ? 'heartPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
      }}
    >
      <span style={{ fontSize: '13px', lineHeight: 1 }}>❤️</span>
      <span className="text-xs font-bold text-red-400 font-mono">{count}</span>
    </div>
  );
}

/* ── Comment dialog modal ──────────────────────────────────── */
function CommentModal({ itemType, itemId, title, section, onClose }) {
  const { getInteraction, addComment } = usePortfolio();
  const interaction = getInteraction(itemType, itemId);
  const comments = interaction.comments || [];
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setPosting(true);
    addComment(itemType, itemId, title, section, author.trim(), text.trim());
    setTimeout(() => {
      setText('');
      setPosting(false);
    }, 300);
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 80px rgba(0,0,0,0.8)' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <div>
            <h3 className="font-bold text-white">Comments</h3>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[240px]">{title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Comments list */}
        <div className="px-5 py-3 max-h-64 overflow-y-auto space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">💬</div>
              <p className="text-slate-500 text-sm">No comments yet — be the first!</p>
            </div>
          ) : (
            comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {c.author?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-white">{c.author}</span>
                    <span className="text-xs text-slate-600">{formatTime(c.time)}</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handleSubmit} className="px-5 pb-5 pt-3 border-t border-white/8">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Your name..."
            className="w-full mb-2 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50"
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-primary-500/50"
              required
            />
            <button
              type="submit"
              disabled={posting || !author.trim() || !text.trim()}
              className="w-10 h-10 rounded-xl bg-primary-600 hover:bg-primary-500 flex items-center justify-center text-white transition-colors disabled:opacity-40"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main LikeCommentBar (embed in each card) ──────────────── */
export default function LikeCommentBar({ itemType, itemId, title, section }) {
  const { data, getInteraction, addLike } = usePortfolio();
  const interaction  = getInteraction(itemType, itemId);
  const likeCount    = interaction.likes    || 0;
  const commentCount = (interaction.comments || []).length;
  const comments     = interaction.comments || [];

  const [particles, setParticles]   = useState([]);
  const [showModal, setShowModal]   = useState(false);
  const [heartBurst, setHeartBurst] = useState(false);

  const handleLike = useCallback(() => {
    addLike(itemType, itemId, title, section);
    const pid = Date.now() + Math.random();
    setParticles(p => [...p, pid]);
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 500);
  }, [addLike, itemType, itemId, title, section]);

  // Build Instagram-style "Liked by" text
  // Rule: use "people" as the generic term.
  // Special case: if someone who commented on THIS item also exists in leads
  // (i.e., they contacted via the message form), use their real name.
  const likedByText = (() => {
    if (likeCount === 0) return null;

    // Find lead names that match commenter names on this item
    const leadNames = (data.leads || []).map(l => l.name?.trim()).filter(Boolean);
    const commenterNames = comments.map(c => c.author?.trim()).filter(Boolean);
    const knownName = commenterNames.find(name =>
      leadNames.some(ln => ln.toLowerCase() === name.toLowerCase())
    );

    if (knownName) {
      if (likeCount === 1)  return `Liked by ${knownName}`;
      if (likeCount === 2)  return `Liked by ${knownName} & 1 other`;
      return `Liked by ${knownName} & ${likeCount - 1} others`;
    }

    // No known name — use generic "people"
    if (likeCount === 1) return `Liked by 1 person`;
    return `Liked by ${likeCount} people`;
  })();

  return (
    <>
      <div className="flex flex-col gap-1.5">
        {/* Buttons row */}
        <div className="flex items-center gap-3">
          {/* Like button */}
          <button
            onClick={handleLike}
            className="relative flex items-center gap-1.5 group"
            title="Like this"
          >
            {/* Flying hearts */}
            {particles.map(pid => (
              <FlyingHeart
                key={pid}
                id={pid}
                onDone={() => setParticles(p => p.filter(x => x !== pid))}
              />
            ))}

            <span
              className="transition-transform duration-200"
              style={{ transform: heartBurst ? 'scale(1.5)' : 'scale(1)', display: 'inline-flex' }}
            >
              <Heart
                size={18}
                className={`transition-all duration-200 ${likeCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400 group-hover:text-red-400'}`}
              />
            </span>
            <span className={`text-xs font-semibold transition-colors ${likeCount > 0 ? 'text-red-400' : 'text-slate-500 group-hover:text-red-400'}`}>
              {likeCount > 0 ? likeCount : 'Like'}
            </span>
          </button>

          {/* Divider */}
          <div className="w-px h-3.5 bg-white/10" />

          {/* Comment button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 group"
            title="Comment"
          >
            <MessageCircle size={17} className="text-slate-400 group-hover:text-primary-400 transition-colors" />
            <span className="text-xs font-semibold text-slate-500 group-hover:text-primary-400 transition-colors">
              {commentCount > 0 ? commentCount : 'Comment'}
            </span>
          </button>
        </div>

        {/* Instagram-style "Liked by" text */}
        {likedByText && (
          <p
            className="text-xs text-slate-500 leading-snug"
            style={{ fontFamily: 'inherit' }}
          >
            <span className="text-slate-400">❤️</span>{' '}
            <span className="font-semibold text-slate-300">{likedByText.split(' ').slice(0, 3).join(' ')}</span>
            {' '}{likedByText.split(' ').slice(3).join(' ')}
          </p>
        )}
      </div>

      {/* Comment modal */}
      {showModal && (
        <CommentModal
          itemType={itemType}
          itemId={itemId}
          title={title}
          section={section}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
