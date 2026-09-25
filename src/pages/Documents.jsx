import { useCallback, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileScan, Info, Upload, X } from 'lucide-react';
import { api } from '../lib/api';
import { useAction } from '../lib/hooks';
import { SAMPLE_DOCS } from '../lib/samples';
import { Confidence, Empty, ErrorNote, MetaLine, Pill, Thinking } from '../components/ui';

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.webp,.docx,.txt,.csv,.md';
const SEV = { high: ['danger', AlertTriangle], medium: ['warn', AlertTriangle], low: ['muted', Info] };
const pretty = (s) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default function Documents() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [over, setOver] = useState(false);
  const input = useRef();
  const { loading, error, result, run } = useAction(useCallback(api.analyzeDocument, []));

  const pick = (f) => { if (f) { setFile(f); setText(''); } };
  const submit = (e) => { e.preventDefault(); run({ file, text }); };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Document intelligence</h2>
          <p>Drop in an invoice, contract, form or scan. The system classifies it, extracts the fields, and flags anything that needs a human.</p>
        </div>
      </div>

      <div className="grid g-work">
        <form className="panel panel-body stack-v" onSubmit={submit}>
          {file ? (
            <div className="file-chip">
              <FileScan size={18} color="var(--accent)" />
              <span>{file.name}</span>
              <small className="muted num">{(file.size / 1024).toFixed(0)} KB</small>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setFile(null)} aria-label="Remove file"><X size={16} /></button>
            </div>
          ) : (
            <label
              className={`drop ${over ? 'over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}
            >
              <Upload size={26} />
              <span><b style={{ color: 'var(--text)' }}>Drop a file</b> or click to browse</span>
              <small>PDF, image, DOCX, TXT or CSV · up to 15 MB</small>
              <input ref={input} type="file" accept={ACCEPT} className="sr-only" onChange={(e) => pick(e.target.files[0])} />
            </label>
          )}

          <div>
            <label className="label" htmlFor="doc-text">Or paste the text</label>
            <textarea id="doc-text" className="textarea" rows={9} value={text} disabled={!!file}
              onChange={(e) => setText(e.target.value)} placeholder="Paste an invoice, contract clause, email…" />
          </div>

          <div>
            <span className="label">Try a sample</span>
            <div className="row">
              {SAMPLE_DOCS.map((s) => (
                <button type="button" key={s.label} className="chip" onClick={() => { setFile(null); setText(s.text); }}>{s.label}</button>
              ))}
            </div>
          </div>

          <ErrorNote>{error}</ErrorNote>
          <button className="btn btn-primary" disabled={loading || (!file && !text.trim())}>
            {loading ? 'Analyzing…' : 'Analyze document'}
          </button>
        </form>

        <section className="panel" aria-live="polite">
          {loading ? (
            <Thinking steps={['Reading document', 'Classifying document type', 'Extracting fields and line items', 'Checking for anomalies', 'Choosing a route']} />
          ) : result ? (
            <DocResult r={result.data} meta={result.meta} />
          ) : (
            <Empty icon={FileScan} title="No document analyzed yet">Results show here: type, extracted fields with confidence, risks and the queue it should go to.</Empty>
          )}
        </section>
      </div>
    </div>
  );
}

function DocResult({ r, meta }) {
  return (
    <>
      <div className="result-head">
        <div>
          <Pill tone="good">{pretty(r.documentType)}</Pill>
          <h3>{r.title}</h3>
          <p>{r.summary}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <small className="muted" style={{ display: 'block', fontSize: 12.5, marginBottom: 4 }}>Confidence</small>
          <Confidence value={r.confidence} />
        </div>
      </div>

      <div className="result-section">
        <h4>Extracted fields</h4>
        <div className="table-scroll">
          <table className="table">
            <tbody>
              {r.fields.map((f) => (
                <tr key={f.label}>
                  <td className="muted" style={{ width: '38%' }}>{f.label}</td>
                  <td style={{ fontWeight: 550 }}>{f.value}</td>
                  <td><Confidence value={f.confidence} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {r.lineItems?.length > 0 && (
        <div className="result-section">
          <h4>Line items</h4>
          <div className="table-scroll">
            <table className="table">
              <thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>
              <tbody>
                {r.lineItems.map((l, i) => (
                  <tr key={i}><td>{l.description}</td><td className="muted">{l.quantity || '—'}</td><td className="num">{l.amount}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="result-section">
        <h4>Flags</h4>
        {r.flags.length ? r.flags.map((f, i) => {
          const [tone, Icon] = SEV[f.severity] ?? SEV.low;
          return <div className="flag" key={i}><Icon size={16} color={`var(--${tone === 'muted' ? 'muted' : tone})`} style={{ flex: 'none', marginTop: 3 }} /><span>{f.message}</span><span style={{ marginLeft: 'auto' }}><Pill tone={tone}>{f.severity}</Pill></span></div>;
        }) : <p className="muted" style={{ margin: 0, fontSize: 14 }}>Nothing unusual found.</p>}
      </div>

      <div className="result-section">
        <h4>Route to <span style={{ color: 'var(--text)' }}>{r.routeTo}</span></h4>
        <ul className="list-plain">{r.nextActions.map((a) => <li key={a}><CheckCircle2 size={16} />{a}</li>)}</ul>
      </div>

      {r.entities?.length > 0 && (
        <div className="result-section">
          <h4>Entities</h4>
          <div className="row">{r.entities.map((e, i) => <span className="chip" key={i} title={e.type}>{e.text}<small style={{ color: 'var(--faint)' }}>{e.type}</small></span>)}</div>
        </div>
      )}
      <MetaLine meta={meta} />
    </>
  );
}
