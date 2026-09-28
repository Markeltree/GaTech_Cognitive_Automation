import { useCallback, useState } from 'react';
import { BrainCircuit, CheckCircle2, UserCheck } from 'lucide-react';
import { api } from '../lib/api';
import { useAction } from '../lib/hooks';
import { SAMPLE_DECISIONS } from '../lib/samples';
import { Confidence, CustomSelect, Empty, ErrorNote, Gauge, MetaLine, Pill, Thinking } from '../components/ui';

const VERDICT = {
  approve: ['good', 'Approve'],
  approve_with_conditions: ['good', 'Approve with conditions'],
  escalate: ['warn', 'Escalate'],
  reject: ['danger', 'Reject'],
};
const IMPACT = { supports: 'var(--good)', opposes: 'var(--danger)', neutral: 'var(--faint)' };
const riskColor = (n) => (n < 40 ? 'var(--good)' : n < 70 ? 'var(--warn)' : 'var(--danger)');

const DOMAIN_OPTIONS = [
  'finance',
  'customer service',
  'procurement',
  'operations',
  'hr',
  'compliance',
  'general',
];

export default function Decisions() {
  const [form, setForm] = useState({ domain: 'finance', scenario: '', policy: '' });
  const { loading, error, result, run } = useAction(useCallback(api.evaluateDecision, []));
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Cognitive decision engine</h2>
          <p>Describe a case and your policy. The engine weighs the evidence, scores the risk and recommends a verdict, and escalates when it isn’t sure.</p>
        </div>
      </div>

      <div className="grid g-work">
        <form className="panel panel-body stack-v" onSubmit={(e) => { e.preventDefault(); run(form); }}>
          <div>
            <span className="label">Start from a template</span>
            <div className="row">
              {SAMPLE_DECISIONS.map((s) => (
                <button type="button" key={s.label} className="chip" aria-pressed={form.scenario === s.scenario}
                  onClick={() => setForm({ domain: s.domain, scenario: s.scenario, policy: s.policy })}>{s.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="d-domain">Domain</label>
            <CustomSelect
              id="d-domain"
              value={form.domain}
              onChange={set('domain')}
              options={DOMAIN_OPTIONS}
            />
          </div>
          <div>
            <label className="label" htmlFor="d-case">Case</label>
            <textarea id="d-case" className="textarea" rows={8} value={form.scenario} onChange={set('scenario')}
              placeholder="What is being decided, and what do we know?" />
          </div>
          <div>
            <label className="label" htmlFor="d-policy">Policy or constraints (optional)</label>
            <textarea id="d-policy" className="textarea" style={{ minHeight: 72 }} rows={2} value={form.policy} onChange={set('policy')}
              placeholder="e.g. Refunds after 30 days need manager approval" />
          </div>
          <ErrorNote>{error}</ErrorNote>
          <button className="btn btn-primary" disabled={loading || !form.scenario.trim()}>{loading ? 'Evaluating…' : 'Evaluate case'}</button>
        </form>

        <section className="panel" aria-live="polite">
          {loading ? (
            <Thinking steps={['Parsing the case', 'Checking against policy', 'Weighing risk factors', 'Ranking alternatives', 'Forming a recommendation']} />
          ) : result ? (
            <DecisionResult r={result.data} meta={result.meta} />
          ) : (
            <Empty icon={BrainCircuit} title="No case evaluated yet">Pick a template on the left to see how the engine reasons.</Empty>
          )}
        </section>
      </div>
    </div>
  );
}

function DecisionResult({ r, meta }) {
  const [tone, label] = VERDICT[r.verdict] ?? ['muted', r.verdict];
  return (
    <>
      <div className="result-head" style={{ alignItems: 'center' }}>
        <div>
          <div className="row"><Pill tone={tone}>{label}</Pill>{r.requiresHumanReview && <Pill tone="warn"><UserCheck size={12} />Human review</Pill>}</div>
          <h3>{r.headline}</h3>
          <div className="row" style={{ fontSize: 13 }}><span className="muted">Confidence</span><Confidence value={r.confidence} /></div>
        </div>
        <Gauge value={r.riskScore} label="risk score" color={riskColor(r.riskScore)} />
      </div>

      <div className="result-section"><h4>Rationale</h4><p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65 }}>{r.rationale}</p></div>

      <div className="result-section">
        <h4>Factors</h4>
        {r.factors.map((f) => (
          <div className="factor" key={f.name}>
            <span><b style={{ fontWeight: 580 }}>{f.name}</b> <span style={{ color: IMPACT[f.impact], fontSize: 12.5 }}>· {f.impact}</span></span>
            <span className="factor-bar" title={`weight ${Math.round(f.weight * 100)}%`}><i style={{ width: `${f.weight * 100}%`, background: IMPACT[f.impact] }} /></span>
            <small>{f.note}</small>
          </div>
        ))}
      </div>

      <div className="result-section">
        <h4>Options, ranked</h4>
        <div className="stack-v" style={{ gap: 8 }}>
          {r.options.map((o, i) => (
            <div className={`option ${i === 0 ? 'best' : ''}`} key={o.option}>
              <b style={{ fontWeight: 580 }}>{o.option}</b><span className="num">{o.score}</span>
              <small>{o.tradeoff}</small>
            </div>
          ))}
        </div>
      </div>

      {r.conditions?.length > 0 && (
        <div className="result-section"><h4>Conditions</h4><ul className="list-plain">{r.conditions.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul></div>
      )}
      <div className="result-section"><h4>Next steps</h4><ul className="list-plain">{r.nextSteps.map((c) => <li key={c}><CheckCircle2 size={16} />{c}</li>)}</ul></div>
      <MetaLine meta={meta} />
    </>
  );
}
