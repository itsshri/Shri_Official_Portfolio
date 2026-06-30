import { useState } from 'react';
import { Save, Upload, Plus, X, Trash2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

export default function AboutPanel() {
  const { data, updateAbout } = usePortfolio();
  const [form, setForm] = useState({ ...data.about });
  const [saved, setSaved] = useState(false);
  const [highlightInput, setHighlightInput] = useState('');

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress before storing to avoid localStorage quota issues
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 800;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.75);
      URL.revokeObjectURL(url);
      // Immediately persist to separate localStorage key
      try { localStorage.setItem('portfolio_photo', compressed); } catch {}
      setForm(f => ({ ...f, photo: compressed }));
    };
    img.src = url;
  };

  const addHighlight = (h) => {
    const clean = h.trim();
    if (clean && !form.highlights.includes(clean)) {
      setForm(f => ({ ...f, highlights: [...f.highlights, clean] }));
    }
    setHighlightInput('');
  };

  const removeHighlight = (h) => setForm(f => ({ ...f, highlights: f.highlights.filter(x => x !== h) }));

  const updateStat = (i, field, value) => {
    const newStats = [...form.stats];
    newStats[i] = { ...newStats[i], [field]: value };
    setForm(f => ({ ...f, stats: newStats }));
  };

  const addStat = () => {
    setForm(f => ({ ...f, stats: [...f.stats, { number: '', label: '' }] }));
  };

  const removeStat = (i) => {
    setForm(f => ({ ...f, stats: f.stats.filter((_, j) => j !== i) }));
  };

  const handleSave = () => {
    updateAbout(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">About</h2>
          <p className="text-sm text-slate-500">Edit your personal information</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            saved ? 'bg-emerald-600 text-white' : 'btn-primary'
          }`}
        >
          <Save size={16} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Photo */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <h3 className="font-semibold text-white">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-300 flex-shrink-0">
            {form.photo ? (
              <img src={form.photo} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-slate-600">S</div>
            )}
          </div>
          <label className="btn-outline cursor-pointer">
            <Upload size={16} /> Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
          {form.photo && (
            <button onClick={() => setForm(f => ({ ...f, photo: null }))} className="text-sm text-rose-400 hover:text-rose-300 transition-colors">Remove</button>
          )}
        </div>
      </div>

      {/* Basic info */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <h3 className="font-semibold text-white">Basic Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', key: 'name', placeholder: 'Shrijith R' },
            { label: 'Role', key: 'role', placeholder: 'Full Stack Developer' },
            { label: 'Location', key: 'location', placeholder: 'Coimbatore, India' },
            { label: 'Availability', key: 'availability', placeholder: 'Available for Opportunities' },
            { label: 'Email', key: 'email', placeholder: 'your@email.com' },
            { label: 'Phone', key: 'phone', placeholder: '+91...' },
            { label: 'GitHub URL', key: 'github', placeholder: 'https://github.com/...' },
            { label: 'LinkedIn URL', key: 'linkedin', placeholder: 'https://linkedin.com/in/...' },
            { label: 'LeetCode URL', key: 'leetcode', placeholder: 'https://leetcode.com/u/...' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <input
                type="text"
                className="input-field"
                placeholder={placeholder}
                value={form[key] || ''}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <h3 className="font-semibold text-white">Biography</h3>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">First Paragraph</label>
          <textarea className="input-field resize-none" rows={4} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Second Paragraph</label>
          <textarea className="input-field resize-none" rows={4} value={form.bio2} onChange={e => setForm(f => ({ ...f, bio2: e.target.value }))} />
        </div>
      </div>

      {/* Education */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <h3 className="font-semibold text-white">Education</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Degree', key: 'education', placeholder: 'B.E. Computer Science...' },
            { label: 'Institution', key: 'college', placeholder: 'MIT, Stanford...' },
            { label: 'Duration', key: 'eduYear', placeholder: '2022 – 2026' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">{label}</label>
              <input type="text" className="input-field" placeholder={placeholder} value={form[key] || ''} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <h3 className="font-semibold text-white">Skill Highlights</h3>
        <div className="flex flex-wrap gap-2">
          {form.highlights.map(h => (
            <span key={h} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/15 border border-primary-500/20 text-primary-300 text-sm">
              {h}
              <button type="button" onClick={() => removeHighlight(h)} className="hover:text-rose-400 transition-colors"><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Add highlight..."
            value={highlightInput}
            onChange={e => setHighlightInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(highlightInput); } }}
          />
          <button onClick={() => addHighlight(highlightInput)} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm transition-colors">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 rounded-2xl bg-surface-200 border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Hero Stats</h3>
            <p className="text-xs text-slate-500 mt-0.5">Stats cycle dynamically every 6 seconds</p>
          </div>
          <button
            type="button"
            onClick={addStat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium transition-colors"
          >
            <Plus size={13} /> Add Stat
          </button>
        </div>
        <div className="space-y-3">
          {form.stats.map((stat, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="flex-1">
                <input type="text" className="input-field" value={stat.number} onChange={e => updateStat(i, 'number', e.target.value)} placeholder="3+" />
              </div>
              <div className="flex-1">
                <input type="text" className="input-field" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} placeholder="Projects Shipped" />
              </div>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="w-9 h-9 flex-shrink-0 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {form.stats.length === 0 && (
            <p className="text-slate-600 text-sm text-center py-4">No stats yet — click Add Stat</p>
          )}
        </div>
      </div>
    </div>
  );
}
