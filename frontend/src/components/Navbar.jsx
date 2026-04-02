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

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(108,99,255,0.4)',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="3" y="3" width="6" height="1.8" rx="0.9" fill="white"/>
              <rect x="3" y="6.6" width="12" height="1.6" rx="0.8" fill="white" opacity="0.75"/>
              <rect x="3" y="10" width="9" height="1.6" rx="0.8" fill="white" opacity="0.5"/>
              <circle cx="13.5" cy="13.5" r="3" fill="white" opacity="0.9"/>
              <path d="M12.3 13.5l1.1 1.1 2.1-2.2" stroke="#6c63ff" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            CV<span style={{ color: 'var(--accent2)' }}>Fixer</span>
          </span>
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