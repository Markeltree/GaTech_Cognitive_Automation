import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  BrainCircuit,
  FileScan,
  LayoutDashboard,
  Menu,
  MessagesSquare,
  Search,
  TrendingUp,
  Workflow
} from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  
  const current = NAV.find((n) => (n.end ? pathname === n.to : pathname.startsWith(n.to)));

  useEffect(() => { document.title = `${current?.label ?? 'Console'} · GaTech`; }, [current]);

  return (
    <div className="console">
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Console navigation">
        <Link to="/console"><Brand name="GaTech" /></Link>
        
        <div className="side-group">Cognitive Modules</div>
        {NAV.map(({ to, end, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
            <Icon size={18} strokeWidth={1.9} />
            <span>{label}</span>
          </NavLink>
        ))}

        <div className="side-foot">
          <b>AI Engine Status</b>
          <ModeBadge />
          <Link to="/" className="btn btn-sm"><ArrowLeft size={14} />Back to Case Study</Link>
        </div>
      </aside>

      {open && <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="main">
        <header className="topbar">
          <button className="btn btn-ghost btn-sm menu-btn" onClick={() => setOpen(true)} aria-label="Open navigation">
            <Menu size={18} />
          </button>

          <h1><span className="crumb">Console / </span>{current?.label}</h1>

          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search platform..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search"
            />
          </div>

          <div className="spacer" />

          <div className="topbar-actions">
            <span className="org">
              <span className="avatar">AO</span>
              <span className="org-info">
                <b>Acme Operations</b>
                <small>Enterprise Admin</small>
              </span>
            </span>
          </div>
        </header>

        <Suspense fallback={<div className="page muted" style={{ padding: 32 }}>Loading module…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
