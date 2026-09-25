import { useCallback, useState } from 'react';
import { Copy, MessagesSquare } from 'lucide-react';
import { api } from '../lib/api';
import { useAction } from '../lib/hooks';
import { SAMPLE_MESSAGES } from '../lib/samples';
import { Confidence, Empty, ErrorNote, MetaLine, Pill, Thinking, useToast } from '../components/ui';

const URGENCY = { low: 'muted', medium: 'muted', high: 'warn', critical: 'danger' };
const pretty = (s) => s.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export default function Language() {
  const [text, setText] = useState('');
  const [channel, setChannel] = useState('email');
  const { loading, error, result, run } = useAction(useCallback(api.analyzeLanguage, []));

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h2>Language understanding</h2>
          <p>Paste any inbound message. The system reads intent, sentiment and urgency in any language, routes it, and drafts the reply.</p>
        </div>
      </div>
      <div className="grid g-work">
        <form className="panel panel-body stack-v" onSubmit={(e) => { e.preventDefault(); run({ text, channel }); }}>
          <div>
            <span className="label">Try a sample</span>
            <div className="row">
              {SAMPLE_MESSAGES.map((s) => (
                <button type="button" key={s.label} className="chip" aria-pressed={text === s.text}
                  onClick={() => { setText(s.text); setChannel(s.channel); }}>{s.label}</button>
              ))}
            </div>
          </div>
          <div>
            <span className="label">Channel</span>
            <div className="row">
              {['email', 'chat', 'ticket', 'call transcript'].map((c) => (
                <button type="button" key={c} className="chip" aria-pressed={channel === c} onClick={() => setChannel(c)}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label" htmlFor="msg">Message</label>
            <textarea id="msg" className="textarea" rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste an email, chat or ticket…" />
          </div>
          <ErrorNote>{error}</ErrorNote>
          <button className="btn btn-primary" disabled={loading || !text.trim()}>{loading ? 'Reading…' : 'Analyze message'}</button>
        </form>

        <section className="panel" aria-live="polite">
          {loading ? <Thinking steps={['Detecting language', 'Classifying intent', 'Scoring sentiment and urgency', 'Drafting a reply']} />
            : result ? <NlpResult r={result.data} meta={result.meta} />
            : <Empty icon={MessagesSquare} title="No message analyzed yet">You’ll see intent, sentiment, entities, the team it routes to, and a reply ready to send.</Empty>}
        </section>
      </div>
    </div>
  );
}

function NlpResult({ r, meta }) {
  const [toast, show] = useToast();
  const pos = ((r.sentimentScore + 1) / 2) * 100;
  return (
    <>
      <div className="result-head">
        <div>
          <div className="row"><Pill tone={URGENCY[r.urgency]}>{pretty(r.urgency)} urgency</Pill><Pill>{r.language}</Pill></div>
          <h3>{pretty(r.intent)}</h3>
          <p>{r.summary}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <small className="muted" style={{ display: 'block', fontSize: 12.5, marginBottom: 4 }}>Intent confidence</small>
          <Confidence value={r.intentConfidence} />
        </div>
      </div>
      <div className="result-section">
        <h4>Sentiment: <span style={{ color: 'var(--text)' }}>{pretty(r.sentiment)}</span> <span className="num">({r.sentimentScore > 0 ? '+' : ''}{r.sentimentScore.toFixed(2)})</span></h4>
        <div className="sentiment-track" role="img" aria-label={`Sentiment ${r.sentimentScore}`}><i style={{ left: `${pos}%` }} /></div>
        <div className="row muted" style={{ justifyContent: 'space-between', fontSize: 12, marginTop: 8 }}><span>Negative</span><span>Neutral</span><span>Positive</span></div>
      </div>
      <div className="result-section">
        <h4>Route to <span style={{ color: 'var(--text)' }}>{r.routeTo}</span></h4>
        <div className="row">{r.topics.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
      </div>
      {r.entities.length > 0 && (
        <div className="result-section"><h4>Entities</h4>
          <div className="row">{r.entities.map((e, i) => <span className="chip" key={i}>{e.text}<small style={{ color: 'var(--faint)' }}>{e.type}</small></span>)}</div>
        </div>
      )}
      <div className="result-section">
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
          <h4 style={{ margin: 0 }}>Suggested reply</h4>
          <button className="btn btn-sm" onClick={() => navigator.clipboard?.writeText(r.suggestedReply).then(() => show('Reply copied'))}><Copy size={14} />Copy reply</button>
        </div>
        <div className="reply">{r.suggestedReply}</div>
      </div>
      <MetaLine meta={meta} />
      {toast}
    </>
  );
}
