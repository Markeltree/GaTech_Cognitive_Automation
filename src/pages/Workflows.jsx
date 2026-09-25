import { useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { api } from '../lib/api';
import { SAMPLE_DOCS } from '../lib/samples';
import { ErrorNote, Pill } from '../components/ui';

// Node layout in SVG units (viewBox 1000 × 290)
const W = 164, H = 64;
const NODES = {
  intake: { x: 16, y: 113, title: 'Inbox intake', sub: 'ap@acme.com' },
  doc: { x: 216, y: 113, title: 'Document AI', sub: 'classify + extract' },
  validate: { x: 416, y: 113, title: 'Validation rules', sub: 'totals, PO, flags' },
  decide: { x: 616, y: 113, title: 'Decision engine', sub: 'approve or escalate' },
  erp: { x: 816, y: 34, title: 'Post to ERP', sub: 'straight-through' },
  review: { x: 816, y: 192, title: 'Human review', sub: 'analyst queue' },
};
const EDGES = [['intake', 'doc'], ['doc', 'validate'], ['validate', 'decide'], ['decide', 'erp'], ['decide', 'review']];

const path = (a, b) => {
  const A = NODES[a], B = NODES[b];
  const x1 = A.x + W, y1 = A.y + H / 2, x2 = B.x, y2 = B.y + H / 2, mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = () => new Date().toLocaleTimeString([], { hour12: false });

export default function Workflows() {
  const [doc, setDoc] = useState(SAMPLE_DOCS[0]);
  const [status, setStatus] = useState({}); // node -> 'active' | 'done'
  const [lit, setLit] = useState(new Set());
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const logRef = useRef();

  const write = (msg, cls = '') => {
    setLog((l) => [...l, { t: stamp(), msg, cls }]);
    requestAnimationFrame(() => logRef.current?.scrollTo({ top: 1e6, behavior: 'smooth' }));
  };
  const step = async (node, from) => {
    if (from) setLit((s) => new Set(s).add(`${from}-${node}`));
    setStatus((s) => ({ ...s, [node]: 'active', ...(from ? { [from]: 'done' } : {}) }));
    await wait(450);
  };

  const reset = () => { setStatus({}); setLit(new Set()); setLog([]); setOutcome(null); setError(null); };

  async function runPipeline() {
    reset();
    setRunning(true);
    try {
      await step('intake');
      write(`Received “${doc.label.toLowerCase()}” (${doc.text.length.toLocaleString()} chars)`);

      await step('doc', 'intake');
      write('Document AI: classifying and extracting…');
      const { data: d } = await api.analyzeDocument({ text: doc.text });
      write(`Classified as ${d.documentType.replace(/_/g, ' ')} · ${d.fields.length} fields · ${Math.round(d.confidence * 100)}% confidence`, 'ok');

      await step('validate', 'doc');
      const serious = d.flags.filter((f) => f.severity !== 'low');
      const lowConf = d.fields.filter((f) => f.confidence < 0.85);
      write(`Rules: ${serious.length} medium/high flags, ${lowConf.length} low-confidence fields`, serious.length ? '' : 'ok');

      await step('decide', 'validate');
      write('Decision engine: evaluating…');
      const scenario = [
        `Automated processing of: ${d.title}.`,
        `Summary: ${d.summary}`,
        `Fields: ${d.fields.map((f) => `${f.label}=${f.value} (${Math.round(f.confidence * 100)}%)`).join('; ')}`,
        `Flags: ${d.flags.map((f) => `[${f.severity}] ${f.message}`).join('; ') || 'none'}`,
        'Question: can this be processed straight-through without a human?',
      ].join('\n');
      const { data: dec } = await api.evaluateDecision({
        domain: 'finance', scenario,
        policy: 'Anything over $10,000 with a medium or high flag must go to human review. Contracts always need legal sign-off.',
      });
      write(`Verdict: ${dec.verdict.replace(/_/g, ' ')} · risk ${dec.riskScore}/100`, 'ok');

      const toReview = dec.requiresHumanReview || ['escalate', 'reject'].includes(dec.verdict);
      const end = toReview ? 'review' : 'erp';
      await step(end, 'decide');
      setStatus((s) => ({ ...s, [end]: 'done' }));
      write(toReview ? `Queued for ${d.routeTo} review with the reasoning attached` : `Posted to ERP; routed to ${d.routeTo}`, 'ok');
      setOutcome({ toReview, d, dec });
    } catch (e) {
      setError(e.message);
      write(`Stopped: ${e.message}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="page stack-v">
      <div className="page-head">
        <div>
          <h2>Intelligent process automation</h2>
          <p>A real end-to-end run: document AI feeds validation rules, which feed the decision engine, which either posts straight through or hands off to a person with the reasoning attached.</p>
        </div>
        <div className="row">
          {SAMPLE_DOCS.slice(0, 2).map((s) => (
            <button key={s.label} className="chip" aria-pressed={doc === s} disabled={running} onClick={() => setDoc(s)}>{s.label}</button>
          ))}
          <button className="btn btn-sm" onClick={reset} disabled={running}><RotateCcw size={14} />Reset</button>
          <button className="btn btn-primary btn-sm" onClick={runPipeline} disabled={running}><Play size={14} />{running ? 'Running…' : 'Run workflow'}</button>
        </div>
      </div>

      <section className="panel">
        <div className="panel-head"><h3>Accounts payable intake</h3><small>v3 · published</small></div>
        <div className="flow panel-body">
          <svg viewBox="0 0 1000 290" role="img" aria-label="Workflow: intake, document AI, validation, decision, then ERP or human review">
            {EDGES.map(([a, b]) => <path key={a + b} d={path(a, b)} className={`edge ${lit.has(`${a}-${b}`) ? 'lit' : ''}`} />)}
            {Object.entries(NODES).map(([id, n]) => (
              <g key={id} className={`node ${status[id] ?? ''}`} transform={`translate(${n.x},${n.y})`}>
                <rect width={W} height={H} rx="12" />
                <circle cx="18" cy={H / 2} r="4" fill={status[id] ? 'var(--accent)' : 'var(--line-strong)'} />
                <text x="32" y="28">{n.title}</text>
                <text x="32" y="46" className="sub">{n.sub}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="log" ref={logRef} aria-live="polite">
          {log.length ? log.map((l, i) => <div key={i}><span className="t">{l.t}</span>  <span className={l.cls}>{l.msg}</span></div>)
            : <span>Press “Run workflow” to process the selected document end to end.</span>}
        </div>
      </section>

      <ErrorNote>{error}</ErrorNote>

      {outcome && (
        <section className="panel">
          <div className="result-head">
            <div>
              <Pill tone={outcome.toReview ? 'warn' : 'good'}>{outcome.toReview ? 'Sent to human review' : 'Processed straight-through'}</Pill>
              <h3>{outcome.dec.headline}</h3>
              <p>{outcome.dec.rationale}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
