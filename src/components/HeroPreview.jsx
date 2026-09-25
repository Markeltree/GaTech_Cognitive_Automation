import { BrainCircuit, FileScan, LayoutDashboard, MessagesSquare, TrendingUp, Workflow } from 'lucide-react';
import { useMetrics } from '../lib/hooks';
import ThroughputChart, { ThroughputLegend } from './ThroughputChart';

const SIDE = [
  [LayoutDashboard, 'Command center'], [Workflow, 'Automation'], [BrainCircuit, 'Decisions'],
  [FileScan, 'Documents'], [MessagesSquare, 'Language'], [TrendingUp, 'Forecasts'],
];

/** A live, scaled-down console rendered from real API data — not a screenshot. */
export default function HeroPreview() {
  const { data } = useMetrics(4000);
  const k = data?.kpis;
  const max = data?.pipeline[0].count ?? 1;

  return (
    <>
      <div className="window-bar" aria-hidden="true"><i /><i /><i /><span>app.gatech.ai/console</span></div>
      <div className="preview" aria-label="Live preview of the GaTech command center">
        <div className="preview-side">
          {SIDE.map(([Icon, label], i) => <div key={label} className={i === 0 ? 'on' : ''}><Icon size={14} />{label}</div>)}
        </div>
        <div className="preview-main">
          <div className="preview-kpis">
            <div><small>Tasks automated</small><b className="num">{k ? k.tasksAutomated.toLocaleString() : '—'}</b></div>
            <div><small>Accuracy</small><b className="num">{k ? `${k.accuracy}%` : '—'}</b></div>
            <div><small>Avg. decision</small><b className="num">{k ? `${(k.avgDecisionMs / 1000).toFixed(1)}s` : '—'}</b></div>
            <div><small>Cost saved</small><b className="num">{k ? `$${(k.costSaved / 1000).toFixed(1)}k` : '—'}</b></div>
          </div>
          <div className="preview-cols">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <small className="muted">Throughput, 24h</small><ThroughputLegend />
              </div>
              {data ? <ThroughputChart data={data.throughput} height={190} compact /> : <div style={{ height: 190 }} />}
            </div>
            <div style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <small className="muted">Document pipeline</small>
              {(data?.pipeline ?? []).map((p) => (
                <div key={p.stage} style={{ display: 'grid', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{p.stage}</span><span className="num muted">{p.count.toLocaleString()}</span></div>
                  <span className="pipe-bar" style={{ height: 6 }}><i style={{ width: `${(p.count / max) * 100}%` }} /></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
