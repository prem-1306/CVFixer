import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8,8,14,0.8)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        {/* Logo Section */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent) 0%, #7c3aed 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(108,99,255,0.3)',
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="7" height="2" rx="1" fill="white"/>
              <rect x="3" y="8" width="14" height="1.8" rx="0.9" fill="white" opacity="0.8"/>
              <rect x="3" y="12" width="10" height="1.8" rx="0.9" fill="white" opacity="0.6"/>
              <circle cx="15" cy="15" r="3.5" fill="white" opacity="0.95"/>
              <path d="M13.5 15l1.2 1.2 2.3-2.3" stroke="var(--accent)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontWeight: 800, 
              fontSize: 22, 
              color: 'var(--text)', 
              letterSpacing: '-0.02em', 
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>CV<span style={{ color: 'var(--accent2)' }}>Fixer</span></span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 500, letterSpacing: '0.01em', marginTop: 2 }}>
              <span style={{ color: 'var(--green)', marginRight: 4 }}>•</span>
              Real ATS Scoring. No Fake Results.
            </span>
          </div>
        </Link>

        {/* Nav right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/" style={{
            padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--font-display)',
            color: pathname === '/' ? 'var(--text)' : 'var(--text2)',
            background: pathname === '/' ? 'var(--bg3)' : 'transparent',
            border: pathname === '/' ? '1px solid var(--border2)' : '1px solid transparent',
            transition: 'all 0.15s',
          }}>Home</Link>

          <Link to="/check" className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>
            Check Resume Free →
          </Link>
        </div>
      </div>
    </nav>
  )
}