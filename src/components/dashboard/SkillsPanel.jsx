import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Code2, Layout, Server, Database, Brain, Terminal } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

const ICON_OPTIONS = ['Code2', 'Layout', 'Server', 'Database', 'Brain', 'Terminal'];
const COLOR_OPTIONS = [
  { label: 'Blue/Cyan', value: 'from-blue-500 to-cyan-500' },
  { label: 'Violet/Purple', value: 'from-violet-500 to-purple-500' },
  { label: 'Green/Emerald', value: 'from-green-500 to-emerald-500' },
  { label: 'Orange/Amber', value: 'from-orange-500 to-amber-500' },
  { label: 'Pink/Rose', value: 'from-pink-500 to-rose-500' },
  { label: 'Yellow/Orange', value: 'from-yellow-500 to-orange-500' },
];

const ICON_MAP = { Code2, Layout, Server, Database, Brain, Terminal };

function SkillCategoryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { category: '', icon: 'Code2', color: 'from-blue-500 to-cyan-500', skills: [] });
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (s) => {
    const clean = s.trim();
    if (clean && !form.skills.includes(clean)) setForm(f => ({ ...f, skills: [...f.skills, clean] }));
    setSkillInput('');
  };

  const removeSkill = (s) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }));

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5 p-6 bg-surface-200 rounded-2xl border border-white/8">
      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Category Name *</label>
        <input type="text" required className="input-field" placeholder="e.g. Languages" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Icon</label>
          <select className="input-field" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
            {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Color</label>
          <select className="input-field" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}>
            {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Skills</label>
        <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
          {form.skills.map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-500/15 border border-primary-500/20 text-primary-300 text-xs font-mono">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="hover:text-rose-400 transition-colors"><X size={11} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Add skill..."
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
          />
          <button type="button" onClick={() => addSkill(skillInput)} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm transition-colors">Add</button>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center"><Save size={16} /> Save Category</button>
        <button type="button" onClick={onCancel} className="btn-outline px-6"><X size={16} /> Cancel</button>
      </div>
    </form>
  );
}

export default function SkillsPanel() {
  const { data, addSkillCategory, updateSkillCategory, deleteSkillCategory } = usePortfolio();
  const [mode, setMode] = useState('list');
  const [editId, setEditId] = useState(null);

  const editingCat = editId ? data.skills.find(s => s.id === editId) : null;

  const handleSave = (form) => {
    if (editId) updateSkillCategory(editId, form);
    else addSkillCategory(form);
    setMode('list'); setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this skill category?')) deleteSkillCategory(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Skills</h2>
          <p className="text-sm text-slate-500">{data.skills.length} categor{data.skills.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        {mode === 'list' && (
          <button onClick={() => setMode('add')} className="btn-primary text-sm px-4 py-2.5">
            <Plus size={16} /> Add Category
          </button>
        )}
      </div>

      {mode === 'list' ? (
        <div className="space-y-3">
          {data.skills.map(cat => {
            const Icon = ICON_MAP[cat.icon] || Code2;
            return (
              <div key={cat.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-200 border border-white/5 hover:border-white/10 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{cat.category}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{cat.skills.join(' · ')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditId(cat.id); setMode('edit'); }} className="w-8 h-8 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 flex items-center justify-center transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SkillCategoryForm
          initial={editingCat}
          onSave={handleSave}
          onCancel={() => { setMode('list'); setEditId(null); }}
        />
      )}
    </div>
  );
}
