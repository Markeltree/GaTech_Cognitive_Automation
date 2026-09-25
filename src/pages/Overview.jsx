import { Link } from 'react-router-dom';
import { Activity, BrainCircuit, CheckCircle2, Clock, DollarSign, FileScan, Gauge as GaugeIcon, MessagesSquare, TrendingUp, Zap } from 'lucide-react';
import { useMetrics } from '../lib/hooks';
import ThroughputChart, { ThroughputLegend } from '../components/ThroughputChart';
import { Empty, ErrorNote } from '../components/ui';

const KIND_ICON = { documents: FileScan, decisions: BrainCircuit, nlp: MessagesSquare, forecasts: TrendingUp };

export function timeAgo(iso) {
  const s = Math.round((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

export function Kpis({ k }) {
  const items = [
    { label: 'Tasks automated today', value: k.tasksAutomated.toLocaleString(), icon: Zap, delta: '+12.4% vs yesterday' },
    { label: 'Extraction accuracy', value: `${k.accuracy}%`, icon: CheckCircle2, delta: '+0.3 pts this week' },
    { label: 'Avg. decision time', value: `${(k.avgDecisionMs / 1000).toFixed(1)}s`, icon: Clock, delta: 'was 2 days by hand' },
    { label: 'Analyst hours saved', value: k.hoursSaved.toLocaleString(), icon: GaugeIcon, delta: 'this month' },
    { label: 'Cost saved', value: `$${k.costSaved.toLocaleString()}`, icon: DollarSign, delta: 'this month' },
  ];
  return (
    <div className="grid g-kpi">
      {items.map(({ label, value, icon: Icon, delta }) => (
        <div className="panel kpi spot" key={label}>
          <div className="label"><span className="kpi-icon"><Icon size={15} /></span>{label}</div>
          <div className="value num">{value}</div>
          <div className="delta">{delta}</div>
        </div>
      ))}
    </div>
  );
}

export default function Overview() {
  const { data, error } = useMetrics();

  if (!data) return <div className="page">{error ? <ErrorNote>Can’t reach the API: {error}. Start the server with <code>npm run dev</code> in <code>/server</code>.</ErrorNote> : <p className="muted">Loading telemetry…</p>}</div>;

  const max = data.pipeline[0].count;

  return (
    <div className="page stack-v">
      <div className="page-head">
        <div>
          <h2>Good to see you</h2>
          <p>Live view of every automated process, model and decision across the organization.</p>
        </div>
        <div className="row">
          <Link to="/console/documents" className="btn btn-sm">Analyze a document</Link>
          <Link to="/console/decisions" className="btn btn-primary btn-sm">New decision</Link>
        </div>
      </div>

      <Kpis k={data.kpis} />

      <div className="grid g-2">
        <section className="panel">
          <div className="panel-head"><h3>Throughput, last 24 hours</h3><ThroughputLegend /></div>
          <div className="panel-body"><ThroughputChart data={data.throughput} /></div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Document pipeline</h3><small>today</small></div>
          <div className="panel-body pipeline">
            {data.pipeline.map((p) => (
              <div className="pipe-row" key={p.stage}>
                <span>{p.stage}</span>
                <span className="pipe-bar"><i style={{ width: `${(p.count / max) * 100}%` }} /></span>
                <span className="num" style={{ textAlign: 'right' }}>{p.count.toLocaleString()}</span>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>
              {Math.round((data.pipeline.at(-1).count / max) * 100)}% straight-through; the rest go to human review.
            </p>
          </div>
        </section>
      </div>

      <div className="grid g-2e">
        <section className="panel">
          <div className="panel-head"><h3>Model health</h3><small>{data.kpis.activeWorkflows} active workflows</small></div>
          <div className="panel-body">
            {data.models.map((m) => (
              <div className="model-row" key={m.name}>
                <span>{m.name}</span>
                <span className="num">{m.accuracy}%</span>
                <span className="pipe-bar" style={{ gridColumn: '1 / -1', height: 6 }}><i style={{ width: `${m.load * 100}%`, background: 'var(--series-b)' }} /></span>
                <small className="muted" style={{ gridColumn: '1 / -1', fontSize: 12.5 }}>{Math.round(m.load * 100)}% capacity in use</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Recent activity</h3><small>from this session</small></div>
          {data.activity.length ? (
            <ul className="activity">
              {data.activity.map((a) => {
                const Icon = KIND_ICON[a.kind] ?? Activity;
                return (
                  <li key={a.id}>
                    <span className="a-icon"><Icon size={16} /></span>
                    <div style={{ minWidth: 0 }}><span style={{ textTransform: 'capitalize' }}>{a.title}</span><small>{a.detail}</small></div>
                    <time dateTime={a.at}>{timeAgo(a.at)}</time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty icon={Activity} title="Nothing run yet">Analyze a document or evaluate a decision and it will show up here.</Empty>
          )}
        </section>
      </div>
    </div>
  );
}
