import { useCallback, useMemo, useState } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { api } from '../lib/api';
import { useAction } from '../lib/hooks';
import { SAMPLE_SERIES } from '../lib/samples';
import { ChartTooltip, Empty, ErrorNote, MetaLine, Pill, Thinking } from '../components/ui';

const IMPACT = { high: 'good', medium: 'warn', low: 'muted' };
const DIRECTION = { growing: 'good', flat: 'muted', declining: 'danger', volatile: 'warn' };

export default function Forecasts() {
  const [preset, setPreset] = useState(SAMPLE_SERIES[0]);
  const [raw, setRaw] = useState(SAMPLE_SERIES[0].series.join(', '));
  const [horizon, setHorizon] = useState(6);
  const { loading, error, result, run } = useAction(useCallback(api.runForecast, []));

  const series = useMemo(() => raw.split(/[\s,;]+/).map(Number).filter(Number.isFinite), [raw]);

  const choose = (p) => { setPreset(p); setRaw(p.series.join(', ')); };
  const submit = (e) => { e.preventDefault(); run({ metric: preset.metric, unit: preset.unit, context: preset.context, series, horizon }); };

  const chart = useMemo(() => {
    if (!result) return null;
    const hist = result.model ? series.slice(0, result.model.fitted.length) : series;
    const rows = hist.map((v, i) => ({ t: `P${i + 1}`, actual: v }));
    const last = rows[rows.length - 1];
    last.forecast = last.actual; // join the lines
    last.band = [last.actual, last.actual];
    result.model.forecast.forEach((f) => rows.push({ t: `P${hist.length + f.step}`, forecast: f.value, band: [f.lower, f.upper] }));
    return rows;
  }, [result, series]);

  const r = result?.data;

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Predictive operations</h2>
          <p>Forecasts are computed statistically on the server (Holt’s linear trend, 80% interval). The AI explains the numbers and turns them into actions; it doesn’t invent them.</p>
        </div>
      </div>

      <div className="grid g-work">
        <form className="panel panel-body stack-v" onSubmit={submit}>
          <div>
            <span className="label">Dataset</span>
            <div className="row">{SAMPLE_SERIES.map((p) => <button type="button" key={p.label} className="chip" aria-pressed={preset === p} onClick={() => choose(p)}>{p.label}</button>)}</div>
          </div>
          <div>
            <label className="label" htmlFor="series">History for “{preset.metric}”, oldest first</label>
            <textarea id="series" className="textarea num" rows={4} style={{ minHeight: 96 }} value={raw} onChange={(e) => setRaw(e.target.value)} />
            <small className="muted" style={{ fontSize: 12.5 }}>{series.length} values</small>
          </div>
          <div>
            <label className="label" htmlFor="h">Periods to forecast: <b style={{ color: 'var(--text)' }}>{horizon}</b></label>
            <input id="h" type="range" min="1" max="12" value={horizon} onChange={(e) => setHorizon(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
          </div>
          <ErrorNote>{error}</ErrorNote>
          <button className="btn btn-primary" disabled={loading || series.length < 4}>{loading ? 'Forecasting…' : 'Run forecast'}</button>
        </form>

        <section className="panel" aria-live="polite">
          {loading ? <Thinking steps={['Fitting trend model', 'Computing prediction interval', 'Explaining drivers and risks', 'Recommending actions']} />
            : r ? (
              <>
                <div className="result-head">
                  <div>
                    <Pill tone={DIRECTION[r.direction]}>{r.direction}</Pill>
                    <h3>{r.headline}</h3>
                    <p className="num">Trend {result.model.trendPerStep > 0 ? '+' : ''}{result.model.trendPerStep} {preset.unit} per period · α {result.model.alpha} · β {result.model.beta}</p>
                  </div>
                </div>
                <div className="result-section">
                  <div className="legend" style={{ marginBottom: 12 }}>
                    <span><i style={{ background: 'var(--series-a)' }} />Actual</span>
                    <span><i style={{ background: 'repeating-linear-gradient(90deg,var(--series-a) 0 4px,transparent 4px 7px)' }} />Forecast</span>
                    <span><i style={{ background: 'var(--series-a)', opacity: 0.25, height: 8 }} />80% interval</span>
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <ComposedChart data={chart} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                      <CartesianGrid stroke="var(--line)" vertical={false} />
                      <XAxis dataKey="t" tick={{ fill: 'var(--faint)', fontSize: 11 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fill: 'var(--faint)', fontSize: 11 }} tickLine={false} axisLine={false} width={52} domain={['auto', 'auto']} tickFormatter={(v) => v.toLocaleString()} />
                      <Tooltip content={<ChartTooltip fmt={(v) => Math.round(v).toLocaleString()} />} cursor={{ stroke: 'var(--line-strong)' }} />
                      <Area dataKey="band" name="80% interval" stroke="none" fill="var(--series-a)" fillOpacity={0.18} isAnimationActive={false} />
                      <Line dataKey="actual" name="Actual" stroke="var(--series-a)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                      <Line dataKey="forecast" name="Forecast" stroke="var(--series-a)" strokeWidth={2} strokeDasharray="5 4" dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="result-section grid g-2e" style={{ gap: 24 }}>
                  <div><h4>Drivers</h4><ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, display: 'grid', gap: 6 }}>{r.drivers.map((d) => <li key={d}>{d}</li>)}</ul></div>
                  <div><h4>Risks</h4><ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, display: 'grid', gap: 6 }}>{r.risks.map((d) => <li key={d}>{d}</li>)}</ul></div>
                </div>
                <div className="result-section">
                  <h4>Recommended actions</h4>
                  <div className="stack-v" style={{ gap: 8 }}>
                    {r.recommendations.map((a) => (
                      <div className="option" key={a.action}><span>{a.action}</span><Pill tone={IMPACT[a.impact]}>{a.impact} impact</Pill></div>
                    ))}
                  </div>
                </div>
                <MetaLine meta={result.meta} />
              </>
            ) : <Empty icon={TrendingUp} title="No forecast yet">Pick a dataset or paste your own numbers, then run the forecast.</Empty>}
        </section>
      </div>
    </div>
  );
}
