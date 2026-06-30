import { useRef, useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Code2, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import { computeTrustScore } from './TrustIris.jsx';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

export default function Contact() {
  const { data, addLead } = usePortfolio();
  const { about } = data;
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    // Score enthusiasm silently and save the lead
    const trustScore = computeTrustScore(form.name, form.subject, form.message);
    addLead({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      trustScore,
    });

    // Open Gmail
    const body = encodeURIComponent(
      `Hi ${about.name},\n\n${form.message}\n\nFrom: ${form.name} (${form.email})`
    );
    const subjectEnc = encodeURIComponent(form.subject);
    window.open(`mailto:${about.email}?subject=${subjectEnc}&body=${body}`);

    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3500);
    }, 800);
  };

  const contactItems = [
    { icon: Mail,   label: 'Email',    value: about.email,    href: `mailto:${about.email}` },
    { icon: Phone,  label: 'Phone',    value: about.phone,    href: `tel:${about.phone}` },
    { icon: MapPin, label: 'Location', value: about.location, href: null },
  ];

  const socialLinks = [
    { icon: Github,   href: about.github,   label: 'GitHub' },
    { icon: Linkedin, href: about.linkedin, label: 'LinkedIn' },
    { icon: Code2,    href: about.leetcode, label: 'LeetCode' },
  ];

  return (
    <section id="contact" className="py-28 bg-surface relative overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-600/5 filter blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-16 text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="section-label">// get in touch</div>
          <h2 className="section-title mb-4">
            Let's Build Something{' '}
            <span className="gradient-text">Together</span>
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            I'm actively looking for full-time roles in full stack development. If you have a role or project in mind, let's talk.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left — Contact info */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-700 delay-100 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            {/* Contact items */}
            <div className="space-y-3">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-100 border border-white/5 hover:border-primary-500/30 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-primary-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">{label}</div>
                    {href ? (
                      <a href={href} className="text-sm font-medium text-slate-300 hover:text-white transition-colors truncate block">{value}</a>
                    ) : (
                      <div className="text-sm font-medium text-slate-300">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/5 border border-primary-500/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-semibold text-sm">{about.availability}</span>
              </div>
              <p className="text-slate-400 text-sm">
                Looking for full-time opportunities in full stack development, backend engineering, or data engineering.
              </p>
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-100 border border-white/5 hover:border-primary-400/40 text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5 text-sm"
                  title={label}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-surface-100 border border-white/8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Send a Message</h3>
                  <p className="text-xs text-slate-500">I typically reply within 24 hours</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Your Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  className="input-field"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  className="input-field resize-none"
                  rows={6}
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
                  status === 'sent'
                    ? 'bg-emerald-600 cursor-default'
                    : status === 'sending'
                    ? 'bg-primary-600 cursor-wait'
                    : 'bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-500 hover:to-violet-500 hover:-translate-y-0.5 shadow-glow hover:shadow-glow'
                }`}
              >
                {status === 'sent' ? (
                  <><CheckCircle size={20} /> Message Sent!</>
                ) : status === 'sending' ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <><Send size={20} /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
