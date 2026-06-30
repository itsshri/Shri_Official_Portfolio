import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon, Video, Github, ExternalLink, Star } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext.jsx';

const BADGE_OPTIONS = ['Featured', 'Full Stack', 'Frontend', 'Backend', 'Mobile', 'AI/ML', 'Open Source'];
const DEFAULT_TECH = ['React', 'Spring Boot', 'Node.js', 'Python', 'MySQL', 'MongoDB', 'Docker', 'AWS'];

function emptyProject() {
  return {
    number: '',
    badge: 'Full Stack',
    title: '',
    description: '',
    tech: [],
    github: '',
    live: '',
    image: null,
    video: null,
    featured: false,
  };
}

function ProjectForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || emptyProject());
  const [techInput, setTechInput] = useState('');

  const addTech = (t) => {
    const cleaned = t.trim();
    if (cleaned && !form.tech.includes(cleaned)) {
      setForm(f => ({ ...f, tech: [...f.tech, cleaned] }));
    }
    setTechInput('');
  };

  const removeTech = (t) => setForm(f => ({ ...f, tech: f.tech.filter(x => x !== t) }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(img.width  * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.8);
      URL.revokeObjectURL(url);
      setForm(f => ({ ...f, image: compressed }));
    };
    img.src = url;
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, video: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-surface-200 rounded-2xl border border-white/8">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Project Number</label>
          <input
            type="text"
            className="input-field"
            placeholder="01"
            value={form.number}
            onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Badge</label>
          <select
            className="input-field"
            value={form.badge}
            onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
          >
            {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Project Title *</label>
        <input type="text" required className="input-field" placeholder="My Awesome Project" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Description *</label>
        <textarea required className="input-field resize-none" rows={4} placeholder="Describe your project..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Tech Stack</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.tech.map(t => (
            <span key={t} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary-500/15 border border-primary-500/20 text-primary-300 text-xs font-mono">
              {t}
              <button type="button" onClick={() => removeTech(t)} className="text-primary-500 hover:text-rose-400 transition-colors"><X size={12} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="input-field flex-1"
            placeholder="Add technology..."
            value={techInput}
            onChange={e => setTechInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput); } }}
          />
          <button type="button" onClick={() => addTech(techInput)} className="px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm transition-colors">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {DEFAULT_TECH.filter(t => !form.tech.includes(t)).map(t => (
            <button type="button" key={t} onClick={() => addTech(t)} className="px-2 py-0.5 rounded-lg bg-surface-300 hover:bg-primary-500/15 text-slate-500 hover:text-primary-300 text-xs transition-colors border border-white/5">
              + {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">GitHub URL</label>
          <div className="relative">
            <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="url" className="input-field pl-9" placeholder="https://github.com/..." value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Live URL</label>
          <div className="relative">
            <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="url" className="input-field pl-9" placeholder="https://myapp.com" value={form.live} onChange={e => setForm(f => ({ ...f, live: e.target.value }))} />
          </div>
        </div>
      </div>

      {/* Media uploads */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Project Image */}
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Project Image</label>
          <div className="relative">
            <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/40 cursor-pointer transition-colors">
              {form.image ? (
                <img src={form.image} alt="" className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <>
                  <ImageIcon size={24} className="text-slate-600" />
                  <span className="text-xs text-slate-500">Click to upload image</span>
                </>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {/* Delete image button */}
            {form.image && (
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, image: '' }))}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                title="Remove image"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {form.image && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Image uploaded — click ✕ to remove
            </p>
          )}
        </div>

        {/* Demo Video */}
        <div>
          <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Demo Video</label>
          <div className="relative">
            <label className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-white/10 hover:border-primary-500/40 cursor-pointer transition-colors">
              {form.video ? (
                <video src={form.video} className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <>
                  <Video size={24} className="text-slate-600" />
                  <span className="text-xs text-slate-500">Click to upload video</span>
                </>
              )}
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
            </label>
            {/* Delete video button */}
            {form.video && (
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, video: '' }))}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                title="Remove video"
              >
                <X size={12} />
              </button>
            )}
          </div>
          {form.video && (
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Video uploaded — click ✕ to remove
            </p>
          )}
          <input
            type="url"
            className="input-field mt-2"
            placeholder="Or paste YouTube URL..."
            value={form.video && !form.video.startsWith('blob') ? form.video : ''}
            onChange={e => setForm(f => ({ ...f, video: e.target.value }))}
          />
        </div>
      </div>


      <div className="flex items-center gap-3">
        <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 rounded border-white/20 bg-surface-200 accent-primary-500" />
        <label htmlFor="featured" className="text-sm text-slate-300 flex items-center gap-1.5">
          <Star size={14} className="text-accent-400" />
          Mark as Featured
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1 justify-center">
          <Save size={16} /> Save Project
        </button>
        <button type="button" onClick={onCancel} className="btn-outline px-6">
          <X size={16} /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function ProjectsPanel() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio();
  const [mode, setMode] = useState('list'); // list | add | edit
  const [editId, setEditId] = useState(null);

  const editingProject = editId ? data.projects.find(p => p.id === editId) : null;

  const handleSave = (form) => {
    if (editId) {
      updateProject(editId, form);
    } else {
      addProject({ ...form, number: form.number || String(data.projects.length + 1).padStart(2, '0') });
    }
    setMode('list');
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) deleteProject(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Projects</h2>
          <p className="text-sm text-slate-500">{data.projects.length} project{data.projects.length !== 1 ? 's' : ''}</p>
        </div>
        {mode === 'list' && (
          <button onClick={() => setMode('add')} className="btn-primary text-sm px-4 py-2.5">
            <Plus size={16} /> Add Project
          </button>
        )}
      </div>

      {mode === 'list' ? (
        <div className="space-y-4">
          {data.projects.map(project => (
            <div key={project.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface-200 border border-white/5 hover:border-white/10 transition-colors group">
              {/* Image thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-300 flex-shrink-0">
                {project.image ? (
                  <img src={project.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold text-lg">{project.number}</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">{project.title}</h3>
                  {project.featured && <Star size={12} className="text-accent-400 fill-current flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{project.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tech.slice(0, 4).map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-primary-500/10 text-primary-400 text-xs font-mono">{t}</span>
                  ))}
                  {project.tech.length > 4 && <span className="text-xs text-slate-600">+{project.tech.length - 4}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {project.video && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center" title="Has video">
                    <Video size={12} className="text-emerald-400" />
                  </div>
                )}
                <button
                  onClick={() => { setEditId(project.id); setMode('edit'); }}
                  className="w-8 h-8 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 flex items-center justify-center transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="w-8 h-8 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {data.projects.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
              <p>No projects yet. Click "Add Project" to get started.</p>
            </div>
          )}
        </div>
      ) : (
        <ProjectForm
          initial={editingProject}
          onSave={handleSave}
          onCancel={() => { setMode('list'); setEditId(null); }}
        />
      )}
    </div>
  );
}
