import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../hooks/useAnalysis'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || ''

/* ─────────────────────────────────────────────
   IMPROVE LOADING ANIMATION — minimum 10 seconds
───────────────────────────────────────────── */
const IMPROVE_STEPS = [
  { label: 'Reading your original resume',        icon: '📄', ms: 1400 },
  { label: 'Extracting your existing skills',     icon: '🔍', ms: 1600 },
  { label: 'Identifying what to recommend',       icon: '🗂️', ms: 1600 },
  { label: 'Strengthening bullet points',         icon: '💪', ms: 1800 },
  { label: 'Restructuring sections for ATS',      icon: '📋', ms: 1600 },
  { label: 'Adding your confirmed skills',        icon: '✅', ms: 1000 },
  { label: 'Final ATS formatting pass',           icon: '✨', ms: 1000 },
]
// Total minimum: 10s

function ImproveLoader({ currentStep, progress }) {
  const [dots, setDots] = useState('')
  const completedIdx = IMPROVE_STEPS.findIndex(s => s.label === currentStep)

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 380)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(8,8,14,0.97)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 500, position: 'relative' }}>

        {/* Center animation */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ position: 'relative', width: 110, height: 110, margin: '0 auto 28px' }}>
            {/* 3 radar rings */}
            {[0,1,2].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1.5px solid rgba(108,99,255,0.2)',
                animation: `radarPing 2.5s ease-out ${i * 0.85}s infinite`
              }} />
            ))}
            {/* outer ring */}
            <div style={{
              position: 'absolute', inset: 6,
              border: '2px solid var(--bg4)',
              borderRadius: '50%'
            }} />
            {/* spinner */}
            <div style={{
              position: 'absolute', inset: 10,
              border: '3px solid var(--bg3)',
              borderTopColor: 'var(--accent)',
              borderRightColor: 'var(--accent2)',
              borderRadius: '50%',
              animation: 'spin 0.85s linear infinite'
            }} />
            {/* icon */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 30
            }}>
              {IMPROVE_STEPS[Math.max(0, completedIdx)]?.icon || '✍️'}
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
            Rewriting Your Resume
          </h2>
          <p style={{ fontSize: 14, color: 'var(--accent2)', fontFamily: 'var(--font-mono)', minHeight: 20 }}>
            {currentStep}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Progress</span>
            <span style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 100, height: 6, overflow: 'visible', position: 'relative' }}>
            <div style={{
              height: '100%', borderRadius: 100,
              background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              width: `${progress}%`,
              transition: 'width 0.7s cubic-bezier(.22,1,.36,1)',
              boxShadow: '0 0 14px var(--accent)',
              position: 'relative',
            }}>
              {/* Glowing tip */}
              <div style={{
                position: 'absolute', right: -2, top: -4, bottom: -4, width: 6,
                background: 'white', borderRadius: 6, opacity: 0.9,
                boxShadow: '0 0 10px white, 0 0 20px var(--accent2)'
              }} />
            </div>
          </div>
        </div>

        {/* Steps list */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '6px 0'
        }}>
          {IMPROVE_STEPS.map((step, i) => {
            const isDone   = completedIdx > i
            const isActive = completedIdx === i
            const isPending= completedIdx < i
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '11px 20px',
                background: isActive ? 'rgba(108,99,255,0.07)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}>
                {/* status dot */}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: isDone ? 'var(--green-bg)' : isActive ? 'rgba(108,99,255,0.2)' : 'var(--bg3)',
                  border: `1px solid ${isDone ? 'var(--green-border)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                  color: isDone ? 'var(--green)' : isActive ? 'var(--accent2)' : 'var(--text3)',
                  transition: 'all 0.3s',
                }}>
                  {isDone ? '✓' : isActive
                    ? <span style={{ animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>⟳</span>
                    : <span style={{ fontSize: 10 }}>{i+1}</span>
                  }
                </div>
                <span style={{
                  fontSize: 13, flex: 1,
                  color: isDone ? 'var(--green)' : isActive ? 'var(--text)' : 'var(--text3)',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'color 0.3s'
                }}>{step.label}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: isDone ? 'var(--green)' : isActive ? 'var(--accent2)' : 'var(--text3)'
                }}>
                  {isDone ? 'done' : isActive ? 'running' : 'pending'}
                </span>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 20, fontFamily: 'var(--font-mono)' }}>
          No fake skills added — only your confirmed skills go in.
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SKILL COLLECTION MODAL — ask user before improving
───────────────────────────────────────────── */
function SkillCollectionModal({ missingSkills, jobRole, onProceed, onClose }) {
  const [extraSkills, setExtraSkills] = useState('')
  const [checkedSkills, setCheckedSkills] = useState([])

  const toggle = (skill) => {
    setCheckedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleProceed = () => {
    // Combine: checked missing skills + manually typed extra skills
    const manualSkills = extraSkills
      .split(/[,\n]+/)
      .map(s => s.trim())
      .filter(s => s.length > 1)
    const allToAdd = [...new Set([...checkedSkills, ...manualSkills])]
    onProceed(allToAdd)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(8,8,14,0.88)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24
    }}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 'var(--r-xl)', padding: '36px 32px',
        width: '100%', maxWidth: 560,
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🛠️</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Before we improve your resume...
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7 }}>
            We found <strong style={{ color: 'var(--red)' }}>{missingSkills.length} missing keywords</strong> for <strong style={{ color: 'var(--accent2)' }}>{jobRole}</strong>.
            <br/>Do you actually know any of these? Check the ones you know — <em>we'll only add real skills.</em>
          </p>
        </div>

        {/* Missing skills checkboxes */}
        {missingSkills.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, fontFamily: 'var(--font-display)' }}>
              ✓ Tick the skills you actually know:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {missingSkills.map(skill => {
                const checked = checkedSkills.includes(skill)
                return (
                  <div
                    key={skill}
                    onClick={() => toggle(skill)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '8px 16px', borderRadius: 100, cursor: 'pointer',
                      background: checked ? 'var(--green-bg)' : 'var(--bg3)',
                      border: `1.5px solid ${checked ? 'var(--green-border)' : 'var(--border2)'}`,
                      color: checked ? 'var(--green)' : 'var(--text2)',
                      fontSize: 14, fontWeight: checked ? 600 : 400,
                      transition: 'all 0.15s ease',
                      userSelect: 'none'
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{checked ? '✓' : '○'}</span>
                    {skill}
                  </div>
                )
              })}
            </div>

            {checkedSkills.length > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 8, fontSize: 13, color: 'var(--green)' }}>
                ✅ {checkedSkills.length} skill{checkedSkills.length > 1 ? 's' : ''} selected — these will be added to your resume.
              </div>
            )}
          </div>
        )}

        {/* Manual extra skills */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 10, fontFamily: 'var(--font-display)' }}>
            + Any other skills you have? (Optional)
          </label>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 10 }}>
            Type skills NOT in your resume that you genuinely know. Comma separated.
          </p>
          <textarea
            rows={3}
            value={extraSkills}
            onChange={e => setExtraSkills(e.target.value)}
            placeholder="e.g. Google Sheets, Canva, Notion, ChatGPT, Looker Studio..."
            style={{ fontSize: 14, resize: 'vertical' }}
          />
        </div>

        {/* Warning */}
        <div style={{ padding: '12px 16px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: 10, fontSize: 13, color: 'var(--amber)', marginBottom: 24, lineHeight: 1.6 }}>
          ⚠️ <strong>Important:</strong> Only add skills you actually know. Fake skills in a resume can get you rejected in technical interviews.
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 22px', borderRadius: 'var(--r-md)', fontSize: 14,
              background: 'transparent', border: '1.5px solid var(--border2)',
              color: 'var(--text2)', fontFamily: 'var(--font-display)', fontWeight: 600
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleProceed}
            style={{
              flex: 1, padding: '12px 22px', borderRadius: 'var(--r-md)', fontSize: 15,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700,
              boxShadow: '0 4px 20px rgba(108,99,255,0.35)'
            }}
          >
            {checkedSkills.length > 0 || extraSkills.trim()
              ? `Add ${checkedSkills.length + extraSkills.split(',').filter(s=>s.trim()).length} skill(s) & Improve →`
              : 'Improve Resume (No new skills) →'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SCORE RING
───────────────────────────────────────────── */
function ScoreRing({ score }) {
  const r = 72
  const circ = 2 * Math.PI * r
  const filled = Math.min(score / 100, 1) * circ
  const color = score >= 75 ? 'var(--green)' : score >= 50 ? 'var(--amber)' : 'var(--red)'
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Average' : score >= 35 ? 'Needs Work' : 'Poor'
  const badgeCls = score >= 65 ? 'b-green' : score >= 50 ? 'b-amber' : 'b-red'
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 176, height: 176, margin: '0 auto 18px' }}>
        <svg width="176" height="176" viewBox="0 0 176 176">
          <circle cx="88" cy="88" r={r} fill="none" stroke="var(--bg4)" strokeWidth="12"/>
          <circle cx="88" cy="88" r={r} fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={`${filled} ${circ}`} strokeLinecap="round"
            transform="rotate(-90 88 88)"
            style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.22,1,.36,1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, color: 'var(--text)', lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>/ 100</span>
        </div>
      </div>
      <span className={`badge ${badgeCls}`} style={{ fontSize: 13 }}>{label}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────
   BREAKDOWN BAR
───────────────────────────────────────────── */
function BreakdownBar({ label, score, max }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 70 ? 'var(--green)' : pct >= 45 ? 'var(--accent)' : pct >= 25 ? 'var(--amber)' : 'var(--red)'
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--text2)' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>{pct}%</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{score}/{max}</span>
        </div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

const TABS = [
  { id: 'score',      label: '📊 ATS Score'     },
  { id: 'keywords',   label: '🔑 Keywords'       },
  { id: 'suggestions',label: '💡 Suggestions'    },
  { id: 'skills',     label: '📚 Skill Gap'      },
  { id: 'improve',    label: '✨ Improve Resume' },
]

/* ─────────────────────────────────────────────
   MAIN RESULTS PAGE
───────────────────────────────────────────── */
export default function ResultsPage() {
  const nav = useNavigate()
  const { results, resumeText, jobRole, improved, setImproved, reset } = useAnalysis()

  const [tab, setTab]                     = useState('score')
  const [showModal, setShowModal]         = useState(false)   // skill collection modal
  const [improving, setImproving]         = useState(false)
  const [improveStep, setImproveStep]     = useState('')
  const [improveProgress, setImproveProgress] = useState(0)
  const [improveErr, setImproveErr]       = useState('')
  const timerRef = useRef(null)

  if (!results) { nav('/check'); return null }

  const {
    total_score, rank_estimate, job_match_percent,
    breakdown, keywords, missing_sections,
    suggestions, skills_to_learn, project_ideas, strengths
  } = results

  /* ── Start improve flow ── */
  const handleImproveClick = () => {
    if (improved) { setTab('improve'); return }
    setTab('improve')
    setShowModal(true)   // show skill collection first
  }

  /* ── After user confirms skills ── */
  const startImproving = async (confirmedSkills) => {
    setShowModal(false)
    setImproving(true)
    setImproveErr('')
    setImproveProgress(0)

    // ── Animate steps over ~10.5 seconds total ──
    let stepIdx = 0
    setImproveStep(IMPROVE_STEPS[0].label)

    const advanceStep = () => {
      stepIdx++
      if (stepIdx < IMPROVE_STEPS.length) {
        setImproveStep(IMPROVE_STEPS[stepIdx].label)
        const prog = Math.round(((stepIdx + 1) / IMPROVE_STEPS.length) * 90)
        setImproveProgress(prog)
        timerRef.current = setTimeout(advanceStep, IMPROVE_STEPS[stepIdx].ms)
      }
    }
    timerRef.current = setTimeout(advanceStep, IMPROVE_STEPS[0].ms)

    // ── API call ──
    const form = new FormData()
    form.append('resume_text', resumeText)
    form.append('job_role', jobRole)
    // Only pass confirmed skills — NOT all missing keywords
    form.append('confirmed_skills', JSON.stringify(confirmedSkills))
    form.append('missing_keywords', JSON.stringify(keywords.missing))
    form.append('suggestions', JSON.stringify(suggestions))

    try {
      // Ensure at least 10 seconds total
      const [res] = await Promise.all([
        axios.post(`${API}/api/improve`, form),
        new Promise(r => setTimeout(r, 10500))  // minimum 10.5s wait
      ])
      clearTimeout(timerRef.current)
      setImproveProgress(100)
      setImproveStep('Done!')
      await new Promise(r => setTimeout(r, 600))
      setImproved(res.data.improved_text)
    } catch (e) {
      clearTimeout(timerRef.current)
      setImproveErr(e.response?.data?.detail || 'Improvement failed. Check backend is running.')
    }
    setImproving(false)
  }

  const downloadTxt = () => {
    const blob = new Blob([improved], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ATS_Resume_${jobRole.replace(/\s+/g,'_')}.txt`
    a.click()
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Skill modal overlay */}
      {showModal && (
        <SkillCollectionModal
          missingSkills={keywords.missing}
          jobRole={jobRole}
          onProceed={startImproving}
          onClose={() => { setShowModal(false) }}
        />
      )}

      {/* Improve loading overlay */}
      {improving && (
        <ImproveLoader currentStep={improveStep} progress={improveProgress} />
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>Resume Analysis</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span className="badge b-accent">🎯 {jobRole}</span>
            <span className="badge" style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text2)' }}>
              {results.keyword_source === 'job_description' ? '✅ From your JD' : 
               results.keyword_source === 'AI_Analysis' ? '✨ Genuine AI Analysis' : 
               '📚 Role keyword database'}
            </span>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => { reset(); nav('/check') }}>← New Analysis</button>
      </div>

      {/* ── Tabs ── */}
      <div className="tabs" style={{ marginBottom: 32 }}>
        {TABS.map(t => (
          <button key={t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => t.id === 'improve' ? handleImproveClick() : setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ════ TAB: ATS SCORE ════ */}
      {tab === 'score' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: '32px 20px' }}>
              <ScoreRing score={total_score} />
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 13, color: 'var(--text3)', textAlign: 'center' }}>
                  {results.keyword_source === 'job_description' ? 'Scored against your JD' : 
                   results.keyword_source === 'AI_Analysis' ? '✨ Analyzed by Deep AI Engine' :
                   `Scored against ${jobRole} keyword database`}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="stat-card">
                <div className="stat-num" style={{ color: 'var(--blue)' }}>{job_match_percent}%</div>
                <div className="stat-label">Job Match</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: 'var(--accent2)', fontSize: 16 }}>{rank_estimate}</div>
                <div className="stat-label">Rank Est.</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: 'var(--green)' }}>{keywords.matched_count}</div>
                <div className="stat-label">Matched</div>
              </div>
              <div className="stat-card">
                <div className="stat-num" style={{ color: 'var(--red)' }}>{keywords.missing_count}</div>
                <div className="stat-label">Missing</div>
              </div>
            </div>

            {strengths?.length > 0 && (
              <div style={{ background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 'var(--r-md)', padding: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: 1, textTransform: 'uppercase' }}>✓ Strengths</div>
                {strengths.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--green)' }}>✓</span><span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 22, fontFamily: 'var(--font-display)' }}>Score Breakdown</div>
              {Object.entries(breakdown).map(([key, val]) => (
                <BreakdownBar key={key} label={val.label} score={val.score} max={val.max} />
              ))}
            </div>

            {missing_sections?.length > 0 && (
              <div style={{ background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: 'var(--r-md)', padding: '16px 20px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>⚠️ Missing Sections</div>
                <p style={{ fontSize: 14, margin: 0 }}>Add these sections: <strong style={{ color: 'var(--amber)' }}>{missing_sections.join(', ')}</strong></p>
              </div>
            )}

            {/* CTA to improve */}
            <div style={{ background: 'rgba(108,99,255,0.07)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 'var(--r-md)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', marginBottom: 4 }}>✨ Want a better resume?</div>
                <p style={{ fontSize: 13, margin: 0 }}>We'll rebuild it properly — only your real skills added.</p>
              </div>
              <button className="btn-primary" onClick={handleImproveClick} style={{ whiteSpace: 'nowrap' }}>Improve Resume →</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ TAB: KEYWORDS ════ */}
      {tab === 'keywords' && (
        <div className="fade-in">
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            {[
              { n: keywords.matched_count, label: 'Keywords found', color: 'var(--green)', bg: 'var(--green-bg)', border: 'var(--green-border)' },
              { n: keywords.missing_count, label: 'Keywords missing', color: 'var(--red)', bg: 'var(--red-bg)', border: 'var(--red-border)' },
              { n: keywords.total, label: 'Total analyzed', color: 'var(--blue)', bg: 'var(--blue-bg)', border: 'var(--blue-border)' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 140, background: s.bg, border: `1px solid ${s.border}`, borderRadius: 'var(--r-md)', padding: '16px 20px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.n}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--green)', marginBottom: 16 }}>
                ✅ Found in your resume ({keywords.matched_count})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {keywords.matched.map(kw => <span key={kw} className="chip chip-green">{kw}</span>)}
              </div>
              {keywords.matched.length === 0 && <p style={{ fontSize: 14, color: 'var(--text3)' }}>No keywords matched yet.</p>}
            </div>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--red)', marginBottom: 8 }}>
                ❌ Missing keywords ({keywords.missing_count})
              </h3>
              <p style={{ fontSize: 13, marginBottom: 14 }}>Add these to your resume — but only if you actually know them:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {keywords.missing.map(kw => <span key={kw} className="chip chip-red">{kw}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ TAB: SUGGESTIONS ════ */}
      {tab === 'suggestions' && (
        <div className="fade-in">
          <p style={{ fontSize: 15, marginBottom: 24 }}>Specific fixes ranked by ATS impact. Fix HIGH priority ones first.</p>
          {suggestions.length === 0
            ? <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text2)' }}><div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div><p>Your resume looks solid! Only minor improvements needed.</p></div>
            : suggestions.map((s, i) => (
              <div key={i} className="suggestion-card" style={{ border: `1px solid ${s.priority === 'high' ? 'rgba(255,107,107,0.2)' : s.priority === 'medium' ? 'rgba(255,212,59,0.15)' : 'var(--border)'}` }}>
                <div style={{ fontSize: 26, paddingTop: 2 }}>{s.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{s.area}</span>
                    <span className={`badge ${s.priority === 'high' ? 'b-red' : s.priority === 'medium' ? 'b-amber' : 'b-blue'}`} style={{ fontSize: 10 }}>{s.priority}</span>
                    {s.impact && <span style={{ fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{s.impact}</span>}
                  </div>
                  <p style={{ fontSize: 14, margin: '0 0 8px' }}>{s.issue}</p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--accent2)', fontSize: 15 }}>→</span>
                    <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500, lineHeight: 1.6 }}>{s.fix}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* ════ TAB: SKILL GAP ════ */}
      {tab === 'skills' && (
        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>📚 Skills to Learn</h3>
            <p style={{ fontSize: 14, marginBottom: 20 }}>Missing skills for <strong style={{ color: 'var(--accent2)' }}>{jobRole}</strong> — only add ones you know:</p>
            {skills_to_learn.length === 0
              ? <p style={{ fontSize: 14, color: 'var(--green)' }}>✅ You have all key skills!</p>
              : skills_to_learn.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: i < 3 ? 'var(--accent)' : 'var(--bg4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>{i+1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{s}</div>
                    <div style={{ fontSize: 12, color: 'var(--text3)' }}>Not found in your resume</div>
                  </div>
                  {i < 3 && <span className="badge b-red" style={{ fontSize: 10 }}>learn</span>}
                </div>
              ))
            }
          </div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 6 }}>🚀 Project Ideas</h3>
            <p style={{ fontSize: 14, marginBottom: 20 }}>Build these to prove your skills:</p>
            {project_ideas.map((p, i) => (
              <div key={i} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{p.title}</span>
                  <span className="badge b-accent" style={{ fontSize: 10 }}>{p.tech}</span>
                </div>
                <p style={{ fontSize: 13, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ TAB: IMPROVE RESUME ════ */}
      {tab === 'improve' && !improving && (
        <div className="fade-in">
          {improveErr && (
            <div style={{ padding: '14px 18px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 10, fontSize: 14, color: 'var(--red)', marginBottom: 20 }}>
              ⚠️ {improveErr}
            </div>
          )}

          {!improved && !showModal && (
            <div style={{ textAlign: 'center', padding: '72px 24px' }}>
              <div style={{ fontSize: 56, marginBottom: 20 }}>✨</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Resume Improver</h3>
              <p style={{ fontSize: 15, maxWidth: 500, margin: '0 auto 12px', lineHeight: 1.8 }}>
                We'll rebuild your resume in clean ATS format — strengthening bullet points, fixing structure, and adding only skills <strong style={{ color: 'var(--green)' }}>you confirm you know</strong>.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 36 }}>
                No fake skills. No fake companies. 100% honest.
              </p>
              <button className="btn-primary" onClick={handleImproveClick} style={{ padding: '14px 40px', fontSize: 16 }}>
                Start Improvement →
              </button>
            </div>
          )}

          {improved && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>✨ Improved Resume</h3>
                  <p style={{ fontSize: 13, margin: 0 }}>Restructured • Bullets strengthened • Only your real skills added</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }} onClick={() => { setImproved(null); setShowModal(true) }}>Redo →</button>
                  <button className="btn-green" onClick={downloadTxt}>⬇ Download .txt</button>
                </div>
              </div>

              <pre style={{
                background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 16,
                padding: '24px 28px', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.85,
                color: 'var(--text)', whiteSpace: 'pre-wrap', maxHeight: 600, overflowY: 'auto',
              }}>{improved}</pre>

              <div style={{ marginTop: 16, padding: '14px 20px', background: 'var(--amber-bg)', border: '1px solid var(--amber-border)', borderRadius: 10, fontSize: 13, color: 'var(--amber)' }}>
                ⚠️ This is text format. Copy into your Word/Google Doc resume template and apply proper formatting before sending to companies.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}