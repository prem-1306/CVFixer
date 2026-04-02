import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg2)', padding: '48px 24px 32px' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40, marginBottom: 40 }}>
          <div style={{ maxWidth: 280 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, marginBottom: 10 }}>
              Resume<span style={{ color: 'var(--accent2)' }}>ATS</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7 }}>
              Real ATS checker for Indian freshers. No fake scores, no paywall, no BS.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <span className="badge b-green">100% Free</span>
              <span className="badge b-accent">No Login</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Tool</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text2)'}>ATS Checker</Link>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text2)'}>Keyword Analyzer</Link>
                <Link to="/check" style={{ fontSize: 14, color: 'var(--text2)', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text2)'}>Resume Improver</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14, fontFamily: 'var(--font-display)' }}>Roles</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Data Analyst', 'Business Analyst', 'MIS Executive', 'Software Engineer'].map(r => (
                  <span key={r} style={{ fontSize: 14, color: 'var(--text2)' }}>{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>© 2025 ResumeATS — Made for Indian freshers 🇮🇳</span>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>Free ATS Checker • Real scoring • No fake results</span>
        </div>
      </div>
    </footer>
  )
}