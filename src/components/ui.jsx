import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, Check, ChevronDown } from 'lucide-react';
import { useHealth } from '../lib/hooks';

export function Brand({ name = 'GA Technology' }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className="brand">
      <svg className="brand-mark" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id={`${id}gaGrad`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="55%" stopColor="#0369A1" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
        {/* Left slanted loop */}
        <path
          d="M19 4H10.5C6 4 2.5 8 1.8 13L0.2 27C-0.6 32.5 2.5 36.5 7.5 36.5H16C20.5 36.5 24 32.5 24.8 27.5L26.4 13C27.2 7.5 24 4 19 4Z"
          stroke={`url(#${id}gaGrad)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Right interlocking slanted loop */}
        <path
          d="M39.5 12H31C26.5 12 23 16 22.2 21L20.6 35C19.8 40.5 23 44.5 28 44.5H36.5C41 44.5 44.5 40.5 45.3 35.5L46.9 21C47.7 15.5 44.5 12 39.5 12Z"
          stroke={`url(#${id}gaGrad)`}
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="brand-text-lockup">
        <span className="brand-title">GA</span>
        <span className="brand-sub">Technology</span>
      </span>
    </span>
  );
}

/** Fixed ambient background (aurora orbs, grid, grain) plus pointer tracking for `.spot` cards. */
export function Backdrop() {
  useEffect(() => {
    const move = (e) => {
      const el = e.target.closest?.('.spot');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', move, { passive: true });
    return () => document.removeEventListener('pointermove', move);
  }, []);
  return (
    <div className="backdrop" aria-hidden="true">
      <i className="orb o1" /><i className="orb o2" /><i className="orb o3" />
      <div className="grid-fade" /><div className="noise" />
    </div>
  );
}

export function ModeBadge() {
  const h = useHealth();
  if (!h) return null;
  if (h.mode === 'live') return <span className="pill pill-good" title={h.model}><i className="dot dot-live" />Live AI</span>;
  if (h.mode === 'demo') return <span className="pill pill-warn" title="Set ANTHROPIC_API_KEY on the server for live analysis"><i className="dot" />Demo data</span>;
  return <span className="pill pill-danger"><i className="dot" />API offline</span>;
}

const TONE = { good: 'pill-good', warn: 'pill-warn', danger: 'pill-danger', muted: 'pill-muted' };
export const Pill = ({ tone = 'muted', children }) => <span className={`pill ${TONE[tone]}`}>{children}</span>;

export function Confidence({ value }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <span className="conf" title={`${pct}% confidence`}>
      <span className="conf-bar"><i style={{ width: `${pct}%`, background: pct < 70 ? 'var(--warn)' : undefined }} /></span>
      <span className="num">{pct}%</span>
    </span>
  );
}

export function Gauge({ value, max = 100, label, color = 'var(--accent)' }) {
  const r = 52, c = 2 * Math.PI * r, pct = Math.min(value / max, 1);
  return (
    <div className="gauge" role="img" aria-label={`${label}: ${value}`}>
      <svg viewBox="0 0 120 120" width="120" height="120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--line)" strokeWidth="9" />
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`} style={{ transition: 'stroke-dasharray .8s ease' }} />
      </svg>
      <div className="g-val"><div><b className="num">{value}</b><small>{label}</small></div></div>
    </div>
  );
}

/** Staged progress while the model works. Steps advance on a timer; purely presentational. */
export function Thinking({ steps }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => Math.min(n + 1, steps.length - 1)), 900);
    return () => clearInterval(t);
  }, [steps.length]);
  return (
    <div className="thinking" aria-live="polite">
      {steps.map((s, n) => (
        <div key={s} className={`thinking-step ${n < i ? 'done' : n === i ? 'on' : ''}`}><span className="ind" />{s}</div>
      ))}
    </div>
  );
}

export function Empty({ icon: Icon, title, children }) {
  return (
    <div className="empty">
      <Icon size={36} strokeWidth={1.4} />
      <b>{title}</b>
      <span style={{ maxWidth: '42ch', fontSize: 14 }}>{children}</span>
    </div>
  );
}

export const ErrorNote = ({ children }) => children ? <div className="error" role="alert"><AlertCircle size={18} style={{ flex: 'none', marginTop: 1 }} />{children}</div> : null;

export function MetaLine({ meta }) {
  if (!meta) return null;
  return (
    <div className="meta-line">
      <span>{meta.mode === 'live' ? `Model: ${meta.model}` : 'Demo response'}</span>
      <span className="num">{(meta.ms / 1000).toFixed(1)}s</span>
      {meta.tokens && <span className="num">{meta.tokens.in.toLocaleString()} in / {meta.tokens.out.toLocaleString()} out tokens</span>}
    </div>
  );
}

export function ChartTooltip({ active, payload, label, fmt = (v) => v?.toLocaleString() }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="tooltip">
      <b>{label}</b>
      {payload.filter((p) => p.value != null).map((p) => (
        <div key={p.dataKey}>
          <i className="dot" style={{ color: p.color || p.stroke }} />
          {p.name}
          <span>{Array.isArray(p.value) ? p.value.map(fmt).join(' – ') : fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => { if (!msg) return; const t = setTimeout(() => setMsg(null), 2600); return () => clearTimeout(t); }, [msg]);
  return [msg ? createPortal(<div className="toast" role="status">{msg}</div>, document.body) : null, setMsg];
}

export function CustomSelect({ value, onChange, options, id, placeholder = 'Select an option' }) {
  const [open, setOpen] = useState(false);

  // Normalize options to objects
  const items = options.map((opt) => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
    }
    return opt;
  });

  const selected = items.find((i) => i.value === value) || items[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && !e.target.closest?.('.custom-select-wrap')) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="custom-select-wrap">
      <button
        type="button"
        id={id}
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="custom-select-val">
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={16} className={`select-arrow ${open ? 'rotate' : ''}`} />
      </button>

      {open && (
        <div className="custom-select-menu" role="listbox">
          {items.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { value: opt.value } });
                  setOpen(false);
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <Check size={16} className="option-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
