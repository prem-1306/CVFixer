import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const ROLES = ['Data Analyst','Business Analyst','MIS Executive','Operations Analyst','Software Engineer','Web Developer','Marketing Analyst','Product Manager']

const FEATURES = [
  { icon: '🧠', title: 'AI Keyword Extraction', desc: 'Deep-learning semantic extraction. If a keyword is related to your resume — it shows matched. Zero false positives.' },
  { icon: '📊', title: 'Genuine AI ATS Score', desc: 'Scored across 5 real dimensions by Google Gemini: Keywords 40%, Skills 25%, Structure 15%, Sections 10%, Readability 10%.' },
  { icon: '⚡', title: 'Generative AI Suggestions', desc: 'Specific, actionable improvements for your exact resume. Not generic advice — exact fixes with expected score impact.' },
  { icon: '🔍', title: 'Intelligent Skill Gap Analysis', desc: 'See exactly which skills you\'re missing vs what the role demands. AI prioritizes by importance.' },
  { icon: '💡', title: 'AI Project Ideas', desc: 'Tailored project suggestions for Data Analyst, BA, MIS, and more. Build a portfolio that actually gets noticed.' },
  { icon: '✨', title: 'AI Resume Writer', desc: 'We genuinely rewrite your resume with missing keywords and stronger bullet points using the STAR method. No fake experience added.' },
]

const STEPS = [
  { n: '01', icon: '📄', title: 'Upload Resume', desc: 'PDF, DOCX, or paste text. We extract real content — no guessing.' },
  { n: '02', icon: '🎯', title: 'Pick Your Role', desc: 'Select target role. Paste JD for laser-accurate keyword matching.' },
  { n: '03', icon: '📈', title: 'Get Real Results', desc: 'ATS score, matched/missing keywords, suggestions, skill gaps — all genuine.' },
]

export default function HomePage() {
  const nav = useNavigate()

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', overflow: 'hidden' }}>

        {/* Background orbs */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(32,201,151,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />

        {/* Premium Floating Bubbles */}
        <motion.div
           animate={{ y: [100, -800], x: [0, 30, -30, 0], rotate: [0, 45, 90] }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           style={{ position: 'absolute', bottom: '-10%', left: '15%', width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(108,99,255,0.4), rgba(108,99,255,0.1))', boxShadow: '0 8px 32px rgba(108,99,255,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1, pointerEvents: 'none' }}
        />
        <motion.div
           animate={{ y: [100, -900], x: [0, -40, 20, 0], rotate: [0, 90, 180] }}
           transition={{ duration: 13, delay: 2, repeat: Infinity, ease: "linear" }}
           style={{ position: 'absolute', bottom: '-20%', right: '12%', width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(32,201,151,0.3), rgba(32,201,151,0.05))', boxShadow: '0 8px 32px rgba(32,201,151,0.15)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1, pointerEvents: 'none' }}
        />
        <motion.div
           animate={{ y: [100, -700], x: [0, 25, -15, 0], rotate: [0, -45, -90] }}
           transition={{ duration: 11, delay: 6, repeat: Infinity, ease: "linear" }}
           style={{ position: 'absolute', bottom: '-15%', right: '35%', width: 45, height: 45, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, rgba(192,132,252,0.4), rgba(192,132,252,0.1))', boxShadow: '0 8px 32px rgba(192,132,252,0.2)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1, pointerEvents: 'none' }}
        />

        <div className="fade-up" style={{ textAlign: 'center', maxWidth: 820, position: 'relative' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 100, padding: '7px 18px', marginBottom: 36, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            ✨ AI Powered &nbsp;•&nbsp; 100% Free &nbsp;•&nbsp; Genuine extraction
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24, lineHeight: 1.08 }}>
            Get your resume<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent2) 0%, #c084fc 50%, var(--blue) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ATS-ready in 60s
            </span>
          </h1>

          <p style={{ fontSize: 19, color: 'var(--text2)', maxWidth: 580, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Enterprise-grade AI keyword analysis. Genuine scoring. Generative AI fixes.<br />
            Built for those who want to get shortlisted — not rejected.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button className="btn-primary" onClick={() => nav('/check')} style={{ fontSize: 17, padding: '15px 38px', position: 'relative', zIndex: 2 }}>
              Check My Resume Free →
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 22px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 15, color: 'var(--text2)', position: 'relative', zIndex: 2 }}>
              ⚡ Instant results &nbsp;•&nbsp; No signup
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['100%', 'Always free'], ['Real', 'Keyword matching'], ['0', 'Fake scores'], ['60s', 'To get results']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--accent2)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }}>How it works</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em' }}>Three steps to a better resume</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {STEPS.map((s, i) => (
              <div key={s.n} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -16, right: -8, fontSize: 80, fontFamily: 'var(--font-display)', fontWeight: 900, color: 'rgba(255,255,255,0.025)', lineHeight: 1, userSelect: 'none' }}>{s.n}</div>
                <div style={{ fontSize: 36, marginBottom: 18 }}>{s.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75 }}>{s.desc}</p>
                {i < 2 && (
                  <div style={{ position: 'absolute', top: '50%', right: -12, transform: 'translateY(-50%)', fontSize: 20, color: 'var(--text3)', zIndex: 2 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--accent2)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }}>Features</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em' }}>Everything to get you shortlisted</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ cursor: 'default' }}>
                <div style={{ fontSize: 34, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES SUPPORTED ── */}
      <section style={{ padding: '64px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'var(--font-display)', fontWeight: 700 }}>Supports all major fresher roles</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {ROLES.map(r => (
              <span key={r} style={{ padding: '8px 20px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 100, fontSize: 15, color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 500 }}>{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '112px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.15 }}>
            Stop getting rejected.<br />Start getting shortlisted.
          </h2>
          <p style={{ fontSize: 16, marginBottom: 44, lineHeight: 1.75 }}>
            Check your ATS score free. No login. No credit card. No BS.
          </p>
          <button className="btn-primary" onClick={() => nav('/check')} style={{ fontSize: 18, padding: '16px 48px' }}>
            Check My Resume Free →
          </button>
        </div>
      </section>
    </div>
  )
}