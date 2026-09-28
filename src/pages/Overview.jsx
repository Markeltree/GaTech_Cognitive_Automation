import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock,
  DollarSign,
  FileScan,
  Gauge as GaugeIcon,
  MessagesSquare,
  TrendingUp,
  Zap
} from 'lucide-react';
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

export function GaTechKpis({ k }) {
  const items = [
    {
      label: 'Tasks automated today',
      value: k?.tasksAutomated?.toLocaleString() || '18,700',
      delta: '+12.4% vs yesterday',
      icon: Zap,
      featured: true,
    },
    {
      label: 'Extraction accuracy',
      value: `${k?.accuracy || 99.6}%`,
      delta: '+0.3 pts this week',
      icon: CheckCircle2,
      featured: false,
    },
    {
      label: 'Avg. decision time',
      value: `${((k?.avgDecisionMs || 2400) / 1000).toFixed(1)}s`,
      delta: 'was 2 days by hand',
      icon: Clock,
      featured: false,
    },
    {
      label: 'Analyst hours saved',
      value: k?.hoursSaved?.toLocaleString() || '1,280',
      delta: 'this month',
      icon: GaugeIcon,
      featured: false,
    },
    {
      label: 'Cost saved',
      value: `$${(k?.costSaved || 124680).toLocaleString()}`,
      delta: 'this month',
      icon: DollarSign,
      featured: false,
    },
  ];

  return (
    <div className="grid g-kpi">
      {items.map(({ label, value, icon: Icon, delta, featured }) => (
        <div className={`kpi ${featured ? 'kpi-featured' : ''}`} key={label}>
          <div className="kpi-top">
            <div>
              <div className="value num">{value}</div>
              <div className="label">{label}</div>
            </div>
            <div className="kpi-icon">
              <Icon size={20} strokeWidth={1.9} />
            </div>
          </div>
          <div className="delta">{delta}</div>
        </div>
      ))}
    </div>
  );
}

export default function Overview() {
  const { data, error } = useMetrics();
  const [chartMode, setChartMode] = useState('bar');

  if (!data) {
    return (
      <div className="page">
        {error ? (
          <ErrorNote>
            Can’t reach the API: {error}. Start the server with <code>npm run dev</code> in <code>/server</code>.
          </ErrorNote>
        ) : (
          <p className="muted" style={{ padding: '24px 0' }}>Loading GaTech telemetry…</p>
        )}
      </div>
    );
  }

  const max = data.pipeline[0].count;

  return (
    <div className="page stack-v">
      <div className="page-head">
        <div>
          <h2>Good to see you</h2>
          <p>Live telemetry and operations across document pipelines, decision engines and cognitive models.</p>
        </div>
        <div className="row">
          <Link to="/console/documents" className="btn btn-sm">Analyze a document</Link>
          <Link to="/console/decisions" className="btn btn-primary btn-sm">New decision</Link>
        </div>
      </div>

      <GaTechKpis k={data.kpis} />

      <div className="grid g-2">
        <section className="panel">
          <div className="panel-head">
            <div className="chart-tabs">
              <button
                className={`chart-tab-btn ${chartMode === 'bar' ? 'active' : ''}`}
                onClick={() => setChartMode('bar')}
              >
                Hourly Volume
              </button>
              <button
                className={`chart-tab-btn ${chartMode === 'area' ? 'active' : ''}`}
                onClick={() => setChartMode('area')}
              >
                Automation Rate
              </button>
            </div>
            <ThroughputLegend />
          </div>
          <div className="panel-body">
            <ThroughputChart
              data={data.throughput}
              chartType={chartMode}
              height={260}
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Document Pipeline</h3>
            <small>today</small>
          </div>
          <div className="panel-body pipeline">
            {data.pipeline.map((p) => (
              <div className="pipe-row" key={p.stage}>
                <span>{p.stage}</span>
                <span className="pipe-bar">
                  <i style={{ width: `${(p.count / max) * 100}%` }} />
                </span>
                <span className="num" style={{ textAlign: 'right', fontWeight: 600 }}>
                  {p.count.toLocaleString()}
                </span>
              </div>
            ))}
            <p className="muted" style={{ fontSize: 13, margin: '10px 0 0' }}>
              <b style={{ color: '#0F172A' }}>{Math.round((data.pipeline.at(-1).count / max) * 100)}%</b> straight-through automation; remaining cases routed to human review.
            </p>
          </div>
        </section>
      </div>

      <div className="grid g-2e">
        <section className="panel">
          <div className="panel-head">
            <h3>Model Health & Workflows</h3>
            <small>{data.kpis.activeWorkflows} active workflows</small>
          </div>
          <div className="panel-body">
            {data.models.map((m) => (
              <div className="model-row" key={m.name}>
                <span style={{ fontWeight: 600 }}>{m.name}</span>
                <span className="num" style={{ color: '#2563EB', fontWeight: 700 }}>{m.accuracy}%</span>
                <span className="pipe-bar" style={{ gridColumn: '1 / -1', height: 7 }}>
                  <i style={{ width: `${m.load * 100}%`, background: '#2563EB' }} />
                </span>
                <small className="muted" style={{ gridColumn: '1 / -1', fontSize: 12.5 }}>
                  {Math.round(m.load * 100)}% active engine capacity in use
                </small>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h3>Recent Platform Activity</h3>
            <small>live telemetry stream</small>
          </div>
          {data.activity && data.activity.length > 0 ? (
            <ul className="activity">
              {data.activity.map((a) => {
                const Icon = KIND_ICON[a.kind] ?? Activity;
                return (
                  <li key={a.id}>
                    <span className="a-icon">
                      <Icon size={17} strokeWidth={1.8} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#0F172A' }}>
                        {a.title}
                      </span>
                      <small style={{ color: '#64748B' }}>{a.detail}</small>
                    </div>
                    <time dateTime={a.at}>{timeAgo(a.at)}</time>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty icon={Activity} title="Nothing run yet">
              Analyze a document or evaluate a decision in the console and it will appear here live.
            </Empty>
          )}
        </section>
      </div>
    </div>
  );
}
