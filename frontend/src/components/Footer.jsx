import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, marginBottom: 12 }}>
              CV<span style={{ color: 'var(--accent2)' }}>Fixer</span>
            </div>
            <p style={{ fontSize: 15, lineHeight: 1.7 }}>
              AI-powered ATS Resume Checker for all job roles. Built for freshers and professionals.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <span className="badge b-green">100% Free</span>
              <span className="badge b-accent">No Login</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Resources</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}>ATS Resume Checker</Link>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}>AI Resume Score</Link>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}>Keyword Analyzer</Link>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}>Resume Rewriter</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Blog</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/blog/ats-resume-tips" style={{ fontSize: 14, color: 'var(--text2)' }}>ATS Resume Tips</Link>
                <Link to="/blog/resume-keywords" style={{ fontSize: 14, color: 'var(--text2)' }}>Modern Resume Keywords</Link>
                <Link to="/blog/fresher-resume-guide" style={{ fontSize: 14, color: 'var(--text2)' }}>Fresher Resume Guide</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Roles Supported</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Data Analyst', 'Business Analyst', 'MIS Executive', 'Software Engineer'].map(r => (
                  <span key={r} style={{ fontSize: 14, color: 'var(--text3)' }}>{r} Job Ready</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 14, color: 'var(--text3)' }}>© 2026 CVFixer — Made for Indian freshers 🇮🇳</span>
          <span style={{ fontSize: 14, color: 'var(--text3)' }}>Contact: <a href="mailto:beginnerstudent218@gmail.com" style={{ color: 'var(--accent2)', textDecoration: 'none' }}>beginnerstudent218@gmail.com</a></span>
          <span style={{ fontSize: 14, color: 'var(--text3)' }}>Free ATS Checker • Real scoring • No fake results</span>
        </div>
      </div>
    </footer>
  )
}