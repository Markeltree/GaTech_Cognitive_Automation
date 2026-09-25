import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, FileScan, LayoutDashboard, Menu, MessagesSquare, TrendingUp, Workflow } from 'lucide-react';
import { Brand, ModeBadge } from './ui';

export const NAV = [
  { to: '/console', end: true, label: 'Command center', icon: LayoutDashboard },
  { to: '/console/workflows', label: 'Process automation', icon: Workflow },
  { to: '/console/decisions', label: 'Decision engine', icon: BrainCircuit },
  { to: '/console/documents', label: 'Document intelligence', icon: FileScan },
  { to: '/console/language', label: 'Language understanding', icon: MessagesSquare },
  { to: '/console/forecasts', label: 'Predictive operations', icon: TrendingUp },
];

export default function ConsoleLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  useEffect(() => { document.title = `${current?.label ?? 'Console'} · GaTech`; }, [current]);

  return (
    <div className="console">
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Console navigation">
        <Link to="/console"><Brand /></Link>
        <div className="side-group">Modules</div>
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.8} />{label}
          </NavLink>
        ))}
        <div className="side-foot glass">
          <b>AI engine status</b>
          <ModeBadge />
          <Link to="/" className="btn btn-sm"><ArrowLeft size={14} />Back to case study</Link>
        </div>
      </aside>
      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="main">
        <header className="topbar">
          <button className="btn btn-ghost btn-sm menu-btn" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={18} /></button>
          <h1><span className="crumb">Console / </span>{current?.label}</h1>
          <div className="spacer" />
          <span className="org"><span className="avatar">AO</span><span>Acme Operations</span></span>
        </header>
        <Suspense fallback={<div className="page muted">Loading…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
