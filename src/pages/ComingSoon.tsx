import { useState } from 'react';
import './coming-soon.css';
import { supabase } from '../lib/supabase';

type FormState = 'idle' | 'loading' | 'done' | 'error';

async function submitEmail(email: string): Promise<string | null> {
  const { error } = await supabase.from('waitlist').insert({ email });
  if (error && error.code !== '23505') return error.message; // 23505 = duplicate, treat as success
  return null;
}

export default function ComingSoon() {
  const [heroState, setHeroState] = useState<FormState>('idle');
  const [ctaState,  setCtaState]  = useState<FormState>('idle');
  const [heroEmail, setHeroEmail] = useState('');
  const [ctaEmail,  setCtaEmail]  = useState('');
  const [heroErr,   setHeroErr]   = useState('');
  const [ctaErr,    setCtaErr]    = useState('');

  async function submitHero(e: React.FormEvent) {
    e.preventDefault();
    setHeroState('loading');
    const err = await submitEmail(heroEmail);
    if (err) { setHeroErr(err); setHeroState('error'); }
    else { setHeroState('done'); }
  }
  async function submitCta(e: React.FormEvent) {
    e.preventDefault();
    setCtaState('loading');
    const err = await submitEmail(ctaEmail);
    if (err) { setCtaErr(err); setCtaState('error'); }
    else { setCtaState('done'); }
  }

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <div className="cs-root">

      {/* Nav */}
      <nav className="cs-nav">
        <div className="cs-logo">
          <span className="cs-logo-e">EDGE</span>
          <span className="cs-logo-f">FORGE</span>
        </div>
        <div className="cs-nav-status">
          <span className="cs-status-dot" aria-hidden="true" />
          In Development
        </div>
      </nav>

      {/* Hero */}
      <section className="cs-hero">
        <div className="cs-hero-content">
          <div className="cs-hero-eyebrow">EdgeForge 2.0</div>
          <h1 className="cs-hero-h1">
            One Engine.<br />Every Market.<br /><em>Full Transparency.</em>
          </h1>
          <p className="cs-hero-sub">
            Every moneyline, run line, total, and player prop runs through the same predictive pipeline — model probability vs. market-implied probability, edge-bucketed, unit-sized. Only what survives the system reaches you.
          </p>

          {heroState === 'done' ? (
            <p className="cs-form-success">You're on the list. We'll reach out when we launch.</p>
          ) : (
            <form className="cs-form" onSubmit={submitHero}>
              <input
                className="cs-email-input"
                type="email"
                placeholder="your@email.com"
                value={heroEmail}
                onChange={e => { setHeroEmail(e.target.value); setHeroState('idle'); }}
                aria-label="Email address"
                required
              />
              <button className="cs-btn" type="submit" disabled={heroState === 'loading'}>
                {heroState === 'loading' ? 'Saving…' : 'Get Early Access'}
              </button>
              {heroState === 'error' && <p className="cs-form-error">{heroErr}</p>}
            </form>
          )}

          <div className="cs-sport-row">
            <span className="cs-sport-label">Covering</span>
            {['MLB','NBA','NHL','WNBA','NFL'].map(s => (
              <span key={s} className="cs-sport-chip">{s}</span>
            ))}
          </div>
        </div>

        {/* Mock pick card */}
        <div className="cs-mock-card" aria-hidden="true">
          <div className="cs-mock-tag">Preview</div>
          <div className="cs-mc-header">
            <div className="cs-mc-logo">
              <span className="cs-mc-logo-e">EDGE</span>
              <span className="cs-mc-logo-f">FORGE</span>
            </div>
            <div className="cs-mc-date">{today}</div>
          </div>
          <div className="cs-mc-label">TODAY'S PICKS</div>

          <div className="cs-mc-pick ultra">
            <div className="cs-mc-row1">
              <div className="cs-mc-matchup">Cubs @ Cardinals</div>
              <div className="cs-mc-badge ultra">ULTRA</div>
            </div>
            <div className="cs-mc-dir">OVER&nbsp; 8.5</div>
            <div className="cs-mc-row2">
              <div className="cs-mc-odds">-110 · Model: 9.41r</div>
              <div className="cs-mc-unit" style={{ color: '#F59E0B' }}>1.0u</div>
            </div>
          </div>

          <div className="cs-mc-pick elite">
            <div className="cs-mc-row1">
              <div className="cs-mc-matchup">Phillies @ Mets</div>
              <div className="cs-mc-badge elite">ELITE</div>
            </div>
            <div className="cs-mc-dir">UNDER  7.0</div>
            <div className="cs-mc-row2">
              <div className="cs-mc-odds">-108 · Model: 6.12r</div>
              <div className="cs-mc-unit" style={{ color: '#F97316' }}>0.75u</div>
            </div>
          </div>

          <div className="cs-mc-pick strong">
            <div className="cs-mc-row1">
              <div className="cs-mc-matchup">Yankees @ Red Sox</div>
              <div className="cs-mc-badge strong">STRONG</div>
            </div>
            <div className="cs-mc-dir">OVER&nbsp; 9.0</div>
            <div className="cs-mc-row2">
              <div className="cs-mc-odds">-115 · Model: 9.87r</div>
              <div className="cs-mc-unit" style={{ color: '#3B82F6' }}>0.5u</div>
            </div>
          </div>

          <div className="cs-mc-footer">
            <div className="cs-mc-record">
              SEASON &nbsp;<span className="w">8W</span> <span className="l">4L</span> 1V
            </div>
            <div className="cs-mc-pnl">+3.21u</div>
          </div>
          <div className="cs-mc-resp">Always gamble responsibly</div>
        </div>
      </section>

      {/* Tier strip */}
      <div className="cs-tier-strip">
        <div className="cs-tier-inner">
          {[
            { name: 'Ultra',  color: 'var(--ultra)',  range: '≥ 18%',   unit: '1.0u',  desc: 'Maximum model-to-market separation. Highest-confidence plays only.' },
            { name: 'Elite',  color: 'var(--elite)',  range: '13–18%',  unit: '0.75u', desc: 'Strong edge with validated signal. Worth pressing with conviction.' },
            { name: 'Strong', color: 'var(--strong)', range: '9–13%',   unit: '0.5u',  desc: 'Clear advantage over market. Included in most card configurations.' },
            { name: 'Solid',  color: 'var(--solid)',  range: '5–9%',    unit: '0.5u',  desc: 'Positive expected value. Appropriate for volume and Pro strategies.' },
          ].map(t => (
            <div className="cs-tier-col" key={t.name}>
              <div className="cs-tier-name" style={{ color: t.color }}>{t.name}</div>
              <div className="cs-tier-range" style={{ color: t.color }}>{t.range}</div>
              <div className="cs-tier-desc">{t.desc}</div>
              <div className="cs-tier-sizing">Default &nbsp;<strong>{t.unit}</strong></div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="cs-process">
        <div className="cs-eyebrow">The Pipeline</div>
        <h2 className="cs-sec-h2">From raw stats to published pick — one deterministic chain.</h2>

        <div
          className="cs-pipeline"
          role="img"
          aria-label="Prediction pipeline: Statistical signals to model probability to market implied probability to edge to tier and unit size"
        >
          {[
            { label: 'Statistical Signals', val: 'ERA · WHIP\nForm · Park', lit: false },
            { label: 'Model Probability',   val: '62.4%',                  lit: false },
            { label: 'Market Implied',      val: '48.1%',                  lit: false },
            { label: 'Edge',                val: '+14.3%',                 lit: true  },
            { label: 'Published As',        val: 'ELITE · 0.75u',          lit: true  },
          ].map(node => (
            <div key={node.label} className={`cs-pipe-node${node.lit ? ' lit' : ''}`}>
              <div className="cs-pipe-label">{node.label}</div>
              <div className="cs-pipe-val" style={{ whiteSpace: 'pre-line' }}>{node.val}</div>
            </div>
          ))}
        </div>

        <p className="cs-process-desc">
          Statistical signals — pitcher ERA and WHIP, team run differentials, park factors, recent form — feed a logistic model that outputs a win or cover probability. That probability is compared against the FanDuel closing line converted to implied probability. The gap is the edge. Edge magnitude determines the confidence tier. The tier determines the unit size. All three are attached to every pick, not buried in a methodology page.
        </p>
      </div>

      {/* Features */}
      <div className="cs-features-bg">
        <div className="cs-features-inner">
          <div className="cs-eyebrow">What's Coming</div>
          <h2 className="cs-sec-h2">Built for the bettor who wants proof before they pay.</h2>
          <div className="cs-features-grid">
            {[
              {
                color: 'var(--forge)', label: 'Prediction Engine',
                h: 'One model. Every market.',
                body: 'Moneylines, run lines, totals, player props — all evaluated through the same pipeline. Market type is a parameter, not a separate product. Every pick carries model probability, implied probability, edge, and units.',
              },
              {
                color: 'var(--ultra)', label: 'Analytics',
                h: 'Public record. Every season.',
                body: "A dedicated analytics page shows how each market has performed — by sport, by season, by tier. Backtested results and live results are clearly separated. You see exactly what the system does before you pay for it.",
              },
              {
                color: 'var(--elite)', label: 'The Daily Card',
                h: 'Your tiers. Your allocation.',
                body: "Configure which confidence tiers you play, set per-tier unit allocations, define your daily risk cap. Conservative, Balanced, and Aggressive presets for quick setup — custom sliders for full control. Thin days produce an honest short card. Discipline is the brand.",
              },
              {
                color: 'var(--green)', label: 'Calibration',
                h: 'Per-sport. Per-market. Independent.',
                body: "Tier thresholds are calibrated independently for each sport and market. A 6% edge on an NBA total and a 6% edge on an NHL spread are graded against their own historical curves — never blended onto a shared scale.",
              },
            ].map(f => (
              <div className="cs-feat-card" key={f.label}>
                <div className="cs-feat-eyebrow" style={{ color: f.color }}>{f.label}</div>
                <h3 className="cs-feat-h3">{f.h}</h3>
                <p className="cs-feat-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cs-cta">
        <h2 className="cs-cta-h2">Be first when we launch.</h2>
        <p className="cs-cta-sub">No spam. One email when EdgeForge 2.0 is live.</p>
        {ctaState === 'done' ? (
          <p className="cs-form-success">You're on the list. We'll reach out when we launch.</p>
        ) : (
          <form className="cs-cta-form" onSubmit={submitCta}>
            <input
              className="cs-email-input"
              type="email"
              placeholder="your@email.com"
              value={ctaEmail}
              onChange={e => { setCtaEmail(e.target.value); setCtaState('idle'); }}
              aria-label="Email address"
              required
            />
            <button className="cs-btn" type="submit" disabled={ctaState === 'loading'}>
              {ctaState === 'loading' ? 'Saving…' : 'Notify Me'}
            </button>
            {ctaState === 'error' && <p className="cs-form-error">{ctaErr}</p>}
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="cs-footer">
        <div className="cs-footer-logo">
          <span className="cs-logo-e">EDGE</span>
          <span className="cs-logo-f">FORGE</span>
          <span style={{ color: 'var(--dim)', fontWeight: 400, fontSize: 11, marginLeft: 8, letterSpacing: 1 }}>2.0</span>
        </div>
        <div className="cs-footer-right">
          Always gamble responsibly.<br />
          © 2026 EdgeForge. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
