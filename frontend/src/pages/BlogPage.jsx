import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BLOG_POSTS = {
  'ats-resume-tips': {
    title: 'Top 10 ATS Resume Tips for 2026',
    date: 'April 11, 2026',
    content: 'Mastering the Applicant Tracking System is the first step to landing your dream job. In this guide, we explore how to optimize your resume for modern AI-driven parsers...',
    readTime: '5 min read'
  },
  'resume-keywords': {
    title: 'Modern Resume Keywords for Tech Roles',
    date: 'April 10, 2026',
    content: 'Keyword stuffing is dead. Semantic relevance is the new king. Learn which high-impact keywords recruiters are actually searching for in 2026...',
    readTime: '7 min read'
  },
  'fresher-resume-guide': {
    title: 'Complete Fresher Resume Guide: From Zero to Hired',
    date: 'April 09, 2026',
    content: 'Starting your career can be daunting. We break down exactly how to structure your resume as a fresher to catch the eye of top enterprise recruiters...',
    readTime: '6 min read'
  }
}

export default function BlogPage() {
  const { slug } = useParams()
  const post = BLOG_POSTS[slug]

  if (!post) {
    return (
      <div style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2>Post Not Found</h2>
        <Link to="/" style={{ color: 'var(--accent2)' }}>Back to Home</Link>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: 800, margin: '0 auto', padding: '80px 24px' }}
    >
      <div style={{ marginBottom: 40 }}>
        <Link to="/" style={{ color: 'var(--text3)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          ← Back to Tools
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <span className="badge b-accent">Career Advice</span>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>{post.date} • {post.readTime}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 24, lineHeight: 1.1 }}>{post.title}</h1>
      </div>

      <div className="card" style={{ background: 'var(--bg2)', padding: '40px', fontSize: 18, lineHeight: 1.8, color: 'var(--text2)' }}>
        <p style={{ marginBottom: 24 }}>{post.content}</p>
        <div style={{ padding: 24, background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 24 }}>
          <h4 style={{ color: 'var(--text)', marginBottom: 8 }}>💡 CVFixer Insight</h4>
          <p style={{ fontSize: 15 }}>Use our <Link to="/check" style={{ color: 'var(--accent2)', textDecoration: 'underline' }}>ATS Checker</Link> to see if your resume already follows these tips.</p>
        </div>
        <p>Full article content strategy placeholder. This page is optimized for SEO with proper heading hierarchy and internal linking.</p>
      </div>
    </motion.div>
  )
}
