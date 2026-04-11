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

        <div className="fade-up" style={{ textAlign: 'center', maxWidth: 820, position: 'relative' }}>

          {/* Pill badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 100, padding: '7px 18px', marginBottom: 36, fontSize: 13, color: 'var(--text2)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            ✨ AI Powered &nbsp;•&nbsp; Free Resume Score Checker &nbsp;•&nbsp; 100% Genuine
          </div>

          {/* Headline (H1 Optimization) */}
          <h1 style={{ fontSize: 'clamp(38px, 6.5vw, 76px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 24, lineHeight: 1.08 }}>
            Free ATS Resume Checker –<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent2) 0%, #c084fc 50%, var(--blue) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
               Beat Recruiter Filters Instantly
            </span>
          </h1>

          <p style={{ fontSize: 19, color: 'var(--text2)', maxWidth: 620, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Analyze your resume in 60 seconds. Get real ATS score, keyword gaps, and AI-powered improvements.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <button className="btn-primary" onClick={() => nav('/check')} style={{ fontSize: 17, padding: '15px 38px', position: 'relative', zIndex: 2 }}>
              Check My Resume Free →
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 12, fontSize: 15, color: 'var(--text2)', position: 'relative', zIndex: 2 }}>
              <span className="badge b-green">No Login Required</span>
              <span className="badge b-blue">100% Free</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[['100%', 'Always free'], ['Gemini', 'AI Powered'], ['99%', 'Keyword Accuracy'], ['60s', 'Result Time']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text)', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 14, color: 'var(--text3)', marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW ATS RESUME CHECKER WORKS ── */}
      <section id="how-it-works" style={{ padding: '96px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.12em', color: 'var(--accent2)', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'var(--font-display)', fontWeight: 700 }}>Expert Guide</div>
            <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em' }}>How CVFixer Analyzes Your Resume</h2>
            <p style={{ maxWidth: 640, margin: '16px auto 0', color: 'var(--text2)' }}>Our AI Engine doesn't just look for words; it understands your professional story.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            <div className="card">
              <div style={{ fontSize: 32, marginBottom: 18 }}>🔍</div>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>1. Deep Semantic Extraction</h3>
              <p style={{ fontSize: 14 }}>We use **Gemini AI** to extract more than just text. We identify skills, impact, and roles even if they use different terminology.</p>
            </div>
            <div className="card">
              <div style={{ fontSize: 32, marginBottom: 18 }}>⚖️</div>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>2. Role-Based Benchmarking</h3>
              <p style={{ fontSize: 14 }}>Your resume is measured against industry standards for your specific target role (e.g., Data Analyst vs Software Engineer).</p>
            </div>
            <div className="card">
              <div style={{ fontSize: 32, marginBottom: 18 }}>📈</div>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>3. Multi-Dimension Scoring</h3>
              <p style={{ fontSize: 14 }}>We score across 5 key areas: Keyword Match, Skills Relevance, Resume Structure, Completeness, and Readability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY RESUMES GET REJECTED ── */}
      <section style={{ padding: '96px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 24 }}>Why Your Resume Gets Rejected by ATS</h2>
              <p style={{ marginBottom: 24, fontSize: 16 }}>Most candidates fail not because of lack of talent, but because of technical "blind spots" that automated systems hate.</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  'Hidden Keyword Gaps: Missing specific tech stacks recruiters search for.',
                  'Poor Formatting: Tables and columns that "break" old ATS parsers.',
                  'Lack of Quantifiable Impact: Not using the STAR method effectively.',
                  'Irrelevant Content: Too much fluff, not enough role-specific value.'
                ].map(txt => (
                  <li key={txt} style={{ display: 'flex', gap: 12, fontSize: 15, color: 'var(--text2)' }}>
                    <span style={{ color: 'var(--red)' }}>✕</span> {txt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ background: 'var(--bg3)', padding: 40, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 20, right: 20, opacity: 0.1, fontSize: 80 }}>⚠️</div>
              <h3 style={{ marginBottom: 16 }}>Expert Tip for Freshers</h3>
              <p style={{ fontSize: 15, lineHeight: 1.8 }}>"Recruiters spend only 6 seconds on a resume. If the ATS doesn't rank you in the top 10%, a human might never even see your application. Use CVFixer to ensure you're in that top bracket."</p>
              <div style={{ marginTop: 24, padding: '12px 18px', background: 'var(--bg4)', borderRadius: 8, fontSize: 13, border: '1px solid var(--border)' }}>
                💡 <strong>Fact:</strong> 75% of resumes are rejected before a human sees them.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPROVE ATS SCORE SECTION ── */}
      <section style={{ padding: '96px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 16 }}>How to Improve Your ATS Score</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 64 }}>Follow these 3 simple steps inside the CVFixer tool to boost your visibility.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'left', padding: 24, borderRadius: 16, background: 'var(--bg)' }}>
              <div style={{ color: 'var(--accent2)', fontWeight: 800, fontSize: 40, marginBottom: 12, opacity: 0.3 }}>01</div>
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>Identify Keyword Gaps</h4>
              <p style={{ fontSize: 14 }}>Our tool highlights missing keywords. Add these naturally into your 'Skills' or 'Work Experience' sections.</p>
            </div>
            <div style={{ textAlign: 'left', padding: 24, borderRadius: 16, background: 'var(--bg)' }}>
              <div style={{ color: 'var(--accent2)', fontWeight: 800, fontSize: 40, marginBottom: 12, opacity: 0.3 }}>02</div>
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>Use the STAR Method</h4>
              <p style={{ fontSize: 14 }}>Our AI Resume Rewriter automatically refines your bullet points to focus on Situation, Task, Action, and Result.</p>
            </div>
            <div style={{ textAlign: 'left', padding: 24, borderRadius: 16, background: 'var(--bg)' }}>
              <div style={{ color: 'var(--accent2)', fontWeight: 800, fontSize: 40, marginBottom: 12, opacity: 0.3 }}>03</div>
              <h4 style={{ fontSize: 18, marginBottom: 8 }}>Role-Specific Projects</h4>
              <p style={{ fontSize: 14 }}>If you're missing a key skill, use our AI-generated project ideas to build a portfolio project that proves your expertise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" style={{ padding: '96px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 800, marginBottom: 10 }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text2)' }}>Everything you need to know about ATS and CVFixer.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { q: "Is this ATS checker really free?", a: "Yes, 100%. We built CVFixer specifically for students and freshers in India to help them land their first jobs without paying for expensive tools." },
              { q: "How accurate is the AI scoring?", a: "We use Google Gemini AI, which is trained on millions of data points. Unlike old rule-based checkers, our AI understands context and synonyms, making it extremely accurate." },
              { q: "Is my resume data safe?", a: "Absolutely. We do not store your resumes permanently. Files are processed in real-time and deleted immediately after analysis." },
              { q: "Why is an ATS score important?", a: "Most companies use software to filter resumes. If your score is low, your resume might not even be seen by a recruiter. A high ATS score ensures your resume gets to a human desk." }
            ].map((item, idx) => (
              <details key={idx} style={{ background: 'var(--bg2)', padding: '20px 24px', borderRadius: 12, border: '1px solid var(--border)', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.q}
                  <span style={{ color: 'var(--accent2)' }}>+</span>
                </summary>
                <p style={{ marginTop: 14, fontSize: 15, color: 'var(--text2)', lineHeight: 1.6 }}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* FAQ Schema */}
        <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "Is this ATS checker really free?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, 100%. We built CVFixer specifically for students and freshers in India to help them land their first jobs without paying for expensive tools." } },
            { "@type": "Question", "name": "How accurate is the AI scoring?", "acceptedAnswer": { "@type": "Answer", "text": "We use Google Gemini AI, which is trained on millions of data points. Unlike old rule-based checkers, our AI understands context and synonyms, making it extremely accurate." } },
            { "@type": "Question", "name": "Is my resume data safe?", "acceptedAnswer": { "@type": "Answer", "text": "Absolutely. We do not store your resumes permanently. Files are processed in real-time and deleted immediately after analysis." } },
            { "@type": "Question", "name": "Why is an ATS score important?", "acceptedAnswer": { "@type": "Answer", "text": "Most companies use software to filter resumes. If your score is low, your resume might not even be seen by a recruiter. A high ATS score ensures your resume gets to a human desk." } }
          ]
        })}
        </script>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '112px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(108,99,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative' }}>
          <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 18, lineHeight: 1.15 }}>
            Ready to get your <br />Dream Job?
          </h2>
          <p style={{ fontSize: 16, marginBottom: 44, lineHeight: 1.75 }}>
            Analyze your resume in 60 seconds. No credit card, no login, just results.
          </p>
          <button className="btn-primary" onClick={() => nav('/check')} style={{ fontSize: 18, padding: '16px 48px' }}>
            Check My Resume Free →
          </button>
        </div>
      </section>
    </div>
  )
}