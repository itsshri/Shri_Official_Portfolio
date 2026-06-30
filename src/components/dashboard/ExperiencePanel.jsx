import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Briefcase, GraduationCap, Award, Upload, MapPin, Calendar } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

const TYPE_OPTIONS = [
  { value: 'work', label: 'Work Experience', icon: Briefcase },
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'cert', label: 'Certification', icon: Award },
];

function emptyExp() {
  return { company: '', logo: null, role: '', duration: '', location: '', type: 'work', bullets: [''] };
}

function ExperienceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyExp());

  const addBullet = () => setForm(f => ({ ...f, bullets: [...f.bullets, ''] }));
  const removeBullet = (i) => setForm(f => ({ ...f, bullets: f.bullets.filter((_, j) => j !== i) }));
  const updateBullet = (i, val) => setForm(f => ({ ...f, bullets: f.bullets.map((b, j) => j === i ? val : b) }));

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 400;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/png', 0.9);
      URL.revokeObjectURL(url);
      setForm(f => ({ ...f, logo: compressed }));
    };
    img.src = url;
  };

  const cleanBullets = form.bullets.filter(b => b.trim());

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave({ ...form, bullets: cleanBullets }); }}
      className="space-y-5 p-6 bg-surface-200 rounded-2xl border border-white/8"
    >
      {/* Type */}
      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Type</label>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => setForm(f => ({ ...f, type: value }))}
              className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                form.type === value
                  ? 'bg-primary-500/15 border-primary-500/30 text-primary-300'
                  : 'bg-surface-300 border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Company / Institution *</label>
          <input type="text" required className="input-field" placeholder="Google, MIT..." value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Role / Degree *</label>
          <input type="text" required className="input-field" placeholder="Senior Engineer..." value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            <Calendar size={11} className="inline mr-1" /> Duration *
          </label>
          <input type="text" required className="input-field" placeholder="Jan 2023 – Present" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">
            <MapPin size={11} className="inline mr-1" /> Location
          </label>
          <input type="text" className="input-field" placeholder="Remote, New York..." value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
        </div>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Company Logo (optional)</label>
        <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/40 cursor-pointer transition-colors">
          {form.logo ? (
            <img src={form.logo} alt="" className="w-10 h-10 object-contain rounded-lg" />
          ) : (
            <Upload size={20} className="text-slate-600" />
          )}
          <span className="text-xs text-slate-500">Upload company logo</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </label>
      </div>

      {/* Bullets */}
      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Key Points</label>
        <div className="space-y-2">
          {form.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-primary-400 text-sm flex-shrink-0">→</span>
              <input
                type="text"
                className="input-field flex-1"
                placeholder={`Key achievement or responsibility ${i + 1}`}
                value={bullet}
                onChange={e => updateBullet(i, e.target.value)}
              />
              {form.bullets.length > 1 && (
                <button type="button" onClick={() => removeBullet(i)} className="text-slate-600 hover:text-rose-400 transition-colors">
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={addBullet} className="mt-2 flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors">
          <Plus size={14} /> Add point
        </button>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center"><Save size={16} /> Save Entry</button>
        <button type="button" onClick={onCancel} className="btn-outline px-6"><X size={16} /> Cancel</button>
      </div>
    </form>
  );
}

const TYPE_ICONS = { work: Briefcase, education: GraduationCap, cert: Award };
const TYPE_COLORS = {
  work: 'text-primary-400 bg-primary-500/10',
  education: 'text-emerald-400 bg-emerald-500/10',
  cert: 'text-accent-400 bg-accent-500/10',
};

export default function ExperiencePanel() {
  const { data, addExperience, updateExperience, deleteExperience } = usePortfolio();
  const [mode, setMode] = useState('list');
  const [editId, setEditId] = useState(null);

  const editingExp = editId ? data.experience.find(e => e.id === editId) : null;

  const handleSave = (form) => {
    if (editId) updateExperience(editId, form);
    else addExperience(form);
    setMode('list'); setEditId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Experience</h2>
          <p className="text-sm text-slate-500">{data.experience.length} entr{data.experience.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        {mode === 'list' && (
          <button onClick={() => setMode('add')} className="btn-primary text-sm px-4 py-2.5">
            <Plus size={16} /> Add Entry
          </button>
        )}
      </div>

      {mode === 'list' ? (
        <div className="space-y-3">
          {data.experience.map(exp => {
            const Icon = TYPE_ICONS[exp.type] || Briefcase;
            return (
              <div key={exp.id} className="flex items-start gap-4 p-4 rounded-2xl bg-surface-200 border border-white/5 hover:border-white/10 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-white/10 ${exp.logo ? '' : (TYPE_COLORS[exp.type] || 'text-primary-400 bg-primary-500/10')}`}>
                  {exp.logo ? (
                    <img src={exp.logo} alt="" className="w-full h-full object-cover" style={{ display: 'block' }} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{exp.company}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{exp.role}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 font-mono">
                    <span className="flex items-center gap-1"><Calendar size={10} />{exp.duration}</span>
                    {exp.location && <span className="flex items-center gap-1"><MapPin size={10} />{exp.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditId(exp.id); setMode('edit'); }} className="w-8 h-8 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 flex items-center justify-center transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => { if (window.confirm('Delete?')) deleteExperience(exp.id); }} className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <ExperienceForm
          initial={editingExp}
          onSave={handleSave}
          onCancel={() => { setMode('list'); setEditId(null); }}
        />
      )}
    </div>
  );
}
