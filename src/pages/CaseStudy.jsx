import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BrainCircuit, CheckCircle2, FileScan, LayoutDashboard, Mail, MapPin, MessagesSquare, Phone, Sparkles, TrendingUp, Workflow } from 'lucide-react';
import { site } from '../site';
import { api } from '../lib/api';
import { Brand, ErrorNote } from '../components/ui';
import HeroPreview from '../components/HeroPreview';

const COMBINES = ['Cognitive process automation', 'Intelligent decision engines', 'Document intelligence', 'Natural language processing', 'Workflow automation', 'Predictive analytics & insights'];
const GOALS = ['Automate complex decision-making processes', 'Reduce manual operational workload', 'Improve business accuracy and efficiency', 'Process unstructured data intelligently', 'Accelerate customer and employee workflows', 'Scale operations with minimal human intervention'];

const FEATURES = [
  {
    icon: Workflow, title: 'Intelligent process automation', to: '/console/workflows',
    body: 'An automation framework that runs complex, multi-step business processes end to end.',
    listTitle: 'Capabilities',
    list: ['Rule-based automation', 'AI-driven decision routing', 'Workflow orchestration', 'Process optimization', 'Context-aware automation'],
    outcome: 'Operations run continuously with less manual intervention and lower dependency on hand-offs.',
  },
  {
    icon: BrainCircuit, title: 'Cognitive decision engine', to: '/console/decisions',
    body: 'A decision layer that analyzes information and makes recommendations the way an experienced operator would.',
    listTitle: 'What it does',
    list: ['Decision support', 'Risk assessment', 'Lead prioritization', 'Customer segmentation', 'Opportunity identification'],
    outcome: 'Faster, more consistent decisions, with a human in the loop when stakes are high.',
  },
  {
    icon: FileScan, title: 'Document intelligence', to: '/console/documents',
    body: 'Reads invoices, contracts, forms and scans, and turns them into structured, validated data.',
    listTitle: 'Supported documents',
    list: ['Invoices and purchase orders', 'Contracts', 'Forms and applications', 'Financial reports', 'Customer records'],
    outcome: 'Document processing time drops sharply and manual review errors go down.',
  },
  {
    icon: MessagesSquare, title: 'Natural language processing', to: '/console/language',
    body: 'Understands inbound email, chat and tickets in any language, and routes them to the right team.',
    listTitle: 'Features',
    list: ['Intent recognition', 'Sentiment analysis', 'Entity detection', 'Text classification', 'Drafted replies'],
    outcome: 'Customer and knowledge-based tasks are handled faster, with consistent tone.',
  },
  {
    icon: TrendingUp, title: 'Predictive operations', to: '/console/forecasts',
    body: 'Forecasting that helps the business anticipate demand and plan capacity before it is needed.',
    listTitle: 'Capabilities',
    list: ['Demand forecasting', 'Customer behavior prediction', 'Risk analysis', 'Resource planning', 'Operational recommendations'],
    outcome: 'Actionable forecasts that improve planning and execution.',
  },
];

const ROADMAP = [
  ['Business process discovery', 'Mapped 40+ manual workflows and ranked them by volume, error rate and value.'],
  ['Core platform development', 'Built the automation runtime, document pipeline and decision layer.'],
  ['Advanced cognitive capabilities', 'Added language understanding, predictive models and human-in-the-loop review.'],
  ['Optimization and deployment', 'Tuned accuracy on production data and rolled out team by team.'],
];

const STATS = [['18.7k', 'tasks automated per day'], ['99.6%', 'extraction accuracy'], ['2.4s', 'average decision, down from 2 days'], ['1,280', 'analyst hours saved per month']];

const STACK = {
  'AI & machine learning': [['Claude', 'Reasoning and extraction'], ['PyTorch', 'Custom models'], ['scikit-learn', 'Classical ML'], ['TensorFlow', 'Model serving'], ['Tesseract', 'OCR fallback'], ['Jupyter', 'Research']],
  'Software development': [['Node.js', 'API services'], ['Express', 'HTTP layer'], ['React', 'Console UI'], ['Vite', 'Build tooling'], ['TypeScript', 'Type safety'], ['PostgreSQL', 'System of record']],
  'Cloud & DevOps': [['AWS', 'Hosting'], ['Docker', 'Containers'], ['Kubernetes', 'Orchestration'], ['Terraform', 'Infrastructure'], ['GitHub Actions', 'CI/CD'], ['Grafana', 'Observability']],
  'Data engineering': [['Kafka', 'Event streaming'], ['Airflow', 'Scheduling'], ['Redis', 'Caching, queues'], ['dbt', 'Transformations'], ['S3', 'Document storage'], ['OpenSearch', 'Search']],
};

export default function CaseStudy() {
  useEffect(() => { document.title = `${site.project.name}: ${site.project.title} · ${site.agency}`; }, []);
  const [tab, setTab] = useState(Object.keys(STACK)[0]);

  return (
    <>
      <header className="site-nav">
        <div className="wrap">
          <Link to="/"><Brand name={site.agency} /></Link>
          <nav aria-label="Sections">
            <a href="#summary">Summary</a>
            <a href="#features">Features</a>
            <a href="#outcomes">Outcomes</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="spacer" />
          <a className="contact-line" href={`mailto:${site.email}`}>{site.email}</a>
          <Link to="/console" className="btn btn-primary btn-sm">Open live demo</Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="wrap">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-tag">Case study</span>{site.project.industry}</span>
              <h1>{site.project.name}<span className="grad">{site.project.title}</span></h1>
              <p className="hero-lede">
                One system that reads, reasons and acts on business work, and hands off to a person when it should.
              </p>
              <div className="hero-actions">
                <Link to="/console" className="btn btn-primary btn-lg"><Sparkles size={17} />Try the platform</Link>
                <a href="#features" className="btn btn-lg">Explore features <ArrowUpRight size={16} className="arrow" /></a>
              </div>
              <dl className="hero-meta">
                <div><dt>Industry</dt><dd>{site.project.industry}</dd></div>
                <div><dt>Stack</dt><dd>{site.project.tech}</dd></div>
              </dl>
            </div>
            <div className="hero-stage">
              <div className="hero-frame">
                <div className="hero-frame-inner"><HeroPreview /></div>
              </div>
            </div>
          </div>
        </section>

        <div className="ribbon" aria-label="Core technologies">
          <div className="wrap">
            {[['AI', 'Reasoning models'], ['ML', 'Machine learning'], ['NLP', 'Language understanding'], ['OCR', 'Document reading']].map(([b, s]) => (
              <div className="ribbon-item glass spot reveal" key={b}><b className="grad">{b}</b><span>{s}</span></div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <section className="section" id="summary">
          <div className="wrap summary-grid">
            <div className="card glass reveal">
              <span className="eyebrow plain">Summary</span>
              <h2 className="h2">Automation that can <span className="grad">reason</span></h2>
              <p className="lede muted">
                We designed and built a cognitive automation platform that combines machine learning, natural language
                processing and document intelligence into one system that can read, reason and act on business work,
                then hand off to a person when it should.
              </p>
              <p className="kicker">The platform combines</p>
              <div className="chip-row">{COMBINES.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
              <p className="pull">
                Unlike rule-only automation, the platform lets organizations automate knowledge-based tasks that need
                reasoning, learning and context: the work that used to need an analyst.
              </p>
            </div>
            <div className="card glass reveal">
              <p className="kicker" style={{ marginTop: 0 }}>What the client needed</p>
              <ul className="checklist">{GOALS.map((g) => <li key={g}><CheckCircle2 size={20} />{g}</li>)}</ul>
            </div>
          </div>
        </section>

        {/* Admin dashboard */}
        <section className="section section-light">
          <div className="wrap split">
            <div className="split-card glass reveal">
              <span className="eyebrow plain">Command center</span>
              <h2 className="h2">Admin dashboard</h2>
              <p className="muted" style={{ margin: 0 }}>
                A central console to manage automation workflows, monitor models and decisions, and keep people in
                control of what the system does.
              </p>
              <ul className="tick-list">
                {['Process management', 'Cognitive workflow monitoring', 'Decision analytics', 'System administration', 'Performance reporting'].map((t) => <li key={t}>{t}</li>)}
              </ul>
              <Link to="/console" className="btn btn-primary" style={{ marginTop: 28 }}><LayoutDashboard size={16} />Open the dashboard</Link>
            </div>
            <div className="hero-frame reveal">
              <div className="hero-frame-inner"><HeroPreview /></div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" id="features">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow plain">Platform</span>
              <h2 className="h2">Core <span className="grad">features</span></h2>
              <p className="lede muted">Each module below is live in the demo console. Try them with your own documents and cases.</p>
            </div>
            <div className="features">
              {FEATURES.map((f) => (
                <article className="feature glass spot reveal" key={f.title}>
                  <span className="icon-tile"><f.icon size={21} /></span>
                  <h3 className="h3">{f.title}</h3>
                  <p>{f.body}</p>
                  <h4>{f.listTitle}</h4>
                  <ul>{f.list.map((l) => <li key={l}>{l}</li>)}</ul>
                  <div className="outcome">{f.outcome}</div>
                  <Link to={f.to} className="btn btn-sm try">Try it live <ArrowUpRight size={14} className="arrow" /></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap roadmap">
            <div className="reveal">
              <span className="eyebrow plain">Delivery</span>
              <h2 className="h2">Execution roadmap</h2>
              <p className="muted" style={{ margin: 0 }}>Delivered in four phases, each shipped to production before the next began.</p>
            </div>
            <ol>{ROADMAP.map(([t, d]) => <li className="glass reveal" key={t}><div><b>{t}</b><span>{d}</span></div></li>)}</ol>
          </div>
        </section>

        {/* Outcomes */}
        <section className="section section-light" id="outcomes">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow plain">Impact</span>
              <h2 className="h2">Key outcomes and impact</h2>
            </div>
            <div className="stat-band">
              {STATS.map(([b, s]) => <div className="glass spot reveal" key={s}><b className="num grad">{b}</b><span>{s}</span></div>)}
            </div>
            <div className="outcomes" style={{ marginTop: 16 }}>
              {GOALS.map((g) => <div className="outcome-row glass reveal" key={g}><CheckCircle2 size={20} />{g}</div>)}
            </div>
          </div>
        </section>

        {/* Quote + CTA */}
        <section className="section">
          <div className="wrap">
            <figure className="quote-card glass reveal" style={{ margin: 0 }}>
              <blockquote>{site.testimonial.quote}</blockquote>
              <figcaption className="quote-by">
                <span className="avatar">{site.testimonial.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>
                <span><b>{site.testimonial.name}</b><small>{site.testimonial.role}</small></span>
              </figcaption>
            </figure>
            <div className="cta reveal">
              <div className="cta-grid" />
              <div>
                <h2>Ready to be our next success story?</h2>
                <p>Let’s build measurable results that move your business forward.</p>
              </div>
              <a href="#contact" className="btn btn-light btn-lg">Start your project <ArrowUpRight size={16} className="arrow" /></a>
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="section section-light">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow plain">Under the hood</span>
              <h2 className="h2">Technology stack</h2>
            </div>
            <div className="stack">
              <div className="stack-tabs glass" role="tablist" aria-label="Technology categories">
                {Object.keys(STACK).map((k) => (
                  <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{k}</button>
                ))}
              </div>
              {/* keyed by tab so the items re-run their entrance animation on switch */}
              <div className="stack-grid" role="tabpanel" key={tab}>
                {STACK[tab].map(([n, d]) => <div className="stack-item glass spot" key={n}><b>{n}</b><span>{d}</span></div>)}
              </div>
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <Brand name={site.agency} />
          <nav><a href="#summary">Summary</a><a href="#features">Features</a><Link to="/console">Live demo</Link><a href={`mailto:${site.email}`}>{site.email}</a></nav>
          <span>© {new Date().getFullYear()} {site.agency}</span>
        </div>
      </footer>
    </>
  );
}

function Contact() {
  const [state, setState] = useState({ sending: false, sent: false, error: null });
  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState({ sending: true, sent: false, error: null });
    try {
      await api.contact(data);
      setState({ sending: false, sent: true, error: null });
      e.target.reset();
    } catch (err) {
      setState({ sending: false, sent: false, error: err.message });
    }
  }
  return (
    <section className="section" id="contact">
      <div className="wrap contact">
        <div className="card glass reveal">
          <span className="eyebrow plain">Contact</span>
          <h2 className="h2">Tell us about the work you want to automate</h2>
          <p className="muted" style={{ margin: 0 }}>We reply within one business day.</p>
          {state.sent ? (
            <p className="pull" style={{ marginTop: 36 }}>Thanks, your message is in. We’ll be in touch within one business day.</p>
          ) : (
            <form className="form-grid" onSubmit={submit}>
              <div className="field"><label htmlFor="c-name">Full name</label><input id="c-name" name="name" required autoComplete="name" /></div>
              <div className="field"><label htmlFor="c-email">Work email</label><input id="c-email" name="email" type="email" required autoComplete="email" /></div>
              <div className="field"><label htmlFor="c-company">Company</label><input id="c-company" name="company" autoComplete="organization" /></div>
              <div className="field"><label htmlFor="c-budget">Budget</label>
                <select id="c-budget" name="budget" defaultValue="">
                  <option value="" disabled>Choose a range</option>
                  <option>Under $25k</option><option>$25k–$100k</option><option>$100k–$250k</option><option>$250k+</option>
                </select>
              </div>
              <div className="field full"><label htmlFor="c-msg">What should we automate?</label><textarea id="c-msg" name="message" required /></div>
              <div className="full" style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
                <ErrorNote>{state.error}</ErrorNote>
                <button className="btn btn-primary btn-lg" disabled={state.sending}>{state.sending ? 'Sending…' : 'Send message'}</button>
              </div>
            </form>
          )}
        </div>
        <aside className="contact-aside glass reveal">
          <dl>
            <div><span className="ci"><Mail size={18} /></span><div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div></div>
            <div><span className="ci"><Phone size={18} /></span><div><dt>Phone</dt><dd>{site.phone}</dd></div></div>
            <div><span className="ci"><MapPin size={18} /></span><div><dt>Office</dt><dd>{site.address}</dd></div></div>
            <div><span className="ci"><Sparkles size={18} /></span><div><dt>Studio</dt><dd>{site.agencyTagline}</dd></div></div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
