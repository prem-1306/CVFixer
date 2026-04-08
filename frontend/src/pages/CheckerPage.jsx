import { useRef, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalysis } from '../hooks/useAnalysis'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import StickmanStory from '../components/StickmanStory'

const API = import.meta.env.VITE_API_URL || ''

const QUICK_ROLES = [
  'Data Analyst','Business Analyst','MIS Executive','Operations Analyst',
  'Software Engineer','Web Developer','Marketing Analyst','Product Manager',
  'HR Executive','Finance Analyst'
]

const LOADING_STEPS = [
  { label: 'Reading your resume text', icon: '📄', duration: 800 },
  { label: 'Loading role keyword database', icon: '🗂️', duration: 700 },
  { label: 'Running real keyword matching', icon: '🔍', duration: 900 },
  { label: 'Computing ATS score breakdown', icon: '📊', duration: 600 },
  { label: 'Generating improvement suggestions', icon: '💡', duration: 700 },
  { label: 'Finalizing your results', icon: '✅', duration: 500 },
]

/* ─── Cinematic Loading Screen (ORIGINAL) ─── */
function LoadingScreen({ currentStep }) {
  const [progress, setProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [dots, setDots] = useState('')

  useEffect(() => {
    const idx = LOADING_STEPS.findIndex(s => s.label === currentStep)
    if (idx >= 0) {
      setProgress(Math.round(((idx + 1) / LOADING_STEPS.length) * 92))
      setCompletedSteps(prev => {
        const newArr = []
        for (let i = 0; i < idx; i++) newArr.push(LOADING_STEPS[i].label)
        return newArr
      })
    }
  }, [currentStep])

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400)
    return () => clearInterval(t)
  }, [])

  const currentIdx = LOADING_STEPS.findIndex(s => s.label === currentStep)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'var(--bg)', position: 'fixed', inset: 0, zIndex: 50
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: 520, position: 'relative' }}>
        {/* Top: Radar + Title */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Radar animation */}
          <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 28px' }}>
            {/* Outer rings */}
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '1.5px solid rgba(108,99,255,0.2)',
                animation: `radarPing 2.4s ease-out ${i * 0.8}s infinite`,
              }} />
            ))}
            {/* Center spinner */}
            <div style={{
              position: 'absolute', inset: 8,
              border: '3px solid var(--bg4)',
              borderTopColor: 'var(--accent)',
              borderRightColor: 'var(--accent2)',
              borderRadius: '50%',
              animation: 'spin 0.9s linear infinite'
            }} />
            {/* Icon center */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: 28
            }}>
              {LOADING_STEPS[currentIdx]?.icon || '🔍'}
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>
            Deep AI Analysis Running
          </h2>
          <p style={{ fontSize: 16, color: 'var(--accent2)', fontFamily: 'var(--font-mono)' }}>
            {currentStep}{dots}
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>Progress</span>
            <span style={{ fontSize: 12, color: 'var(--accent2)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{progress}%</span>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: 100, height: 6, overflow: 'hidden', position: 'relative' }}>
            {/* Scanner line inside progress */}
            <div className="scanner-box" style={{ height: '100%', background: 'transparent' }}>
              <div style={{
                height: '100%', borderRadius: 100,
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                width: `${progress}%`,
                transition: 'width 0.6s cubic-bezier(.22,1,.36,1)',
                boxShadow: '0 0 12px var(--accent)',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', right: 0, top: -3, bottom: -3, width: 4,
                  background: 'white', borderRadius: 4, opacity: 0.8,
                  boxShadow: '0 0 8px white',
                  animation: 'glowPulse 1s ease infinite'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* Step checklist */}
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', padding: '8px 0', overflow: 'hidden'
        }}>
          {LOADING_STEPS.map((step, i) => {
            const isDone    = completedSteps.includes(step.label)
            const isActive  = step.label === currentStep
            const isPending = !isDone && !isActive

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 22px',
                background: isActive ? 'rgba(108,99,255,0.07)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.3s ease',
                animation: isActive ? 'stepReveal 0.3s ease forwards' : 'none'
              }}>
                {/* Status icon */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  background: isDone ? 'var(--green-bg)' : isActive ? 'rgba(108,99,255,0.2)' : 'var(--bg3)',
                  border: `1px solid ${isDone ? 'var(--green-border)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                  color: isDone ? 'var(--green)' : isActive ? 'var(--accent2)' : 'var(--text3)',
                  animation: isDone ? 'checkPop 0.4s ease forwards' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  {isDone ? '✓' : isActive ? <span style={{ animation: 'spin 1.2s linear infinite', display: 'inline-block' }}>⟳</span> : i + 1}
                </div>

                {/* Label */}
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 15, fontWeight: isActive ? 600 : 400,
                    color: isDone ? 'var(--green)' : isActive ? 'var(--text)' : 'var(--text3)',
                    transition: 'color 0.3s'
                  }}>
                    {step.label}
                  </span>
                </div>

                {/* Right: status */}
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                  {isDone && <span style={{ color: 'var(--green)' }}>done</span>}
                  {isActive && <span style={{ color: 'var(--accent2)', animation: 'pulse 1s infinite' }}>running</span>}
                  {isPending && <span style={{ color: 'var(--text3)' }}>waiting</span>}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text3)', marginTop: 24 }}>
          <span style={{color: 'var(--accent)', fontWeight: 600}}>Wait a minute!</span> This is a genuine AI extraction. It takes a few seconds to run properly. 🤖✨
        </p>
      </div>
    </div>
  )
}

export default function CheckerPage() {
  const nav = useNavigate()
  const fileRef = useRef()
  const { resumeText, setResumeText, fileName, setFileName, jobRole, setJobRole, jobDesc, setJobDesc, setResults, reset } = useAnalysis()

  const [step, setStep]         = useState(resumeText ? 'role' : 'upload')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState('')
  const [error, setError]       = useState('')
  const [introFinished, setIntroFinished] = useState(false)
  const [extractProgress, setExtractProgress] = useState(0)

  useEffect(() => {
    if (!introFinished) {
      setTimeout(() => setIntroFinished(true), 3000)
    }
  }, [introFinished])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    setError('')
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf','docx','txt'].includes(ext)) { setError('Only PDF, DOCX, or TXT files allowed.'); return }
    if (file.size > 5 * 1024 * 1024) { setError('File too large. Max 5MB.'); return }

    // Reset role & desc so user picks fresh for new file
    setJobRole('')
    setJobDesc('')

    setUploading(true)
    setStep('extracting') // Trigger the animation step
    setExtractProgress(0)

    // Smooth progress from 0 to 99 over 10 seconds
    let currentP = 0;
    const interval = setInterval(() => {
      currentP += Math.random() * 2 + 1; 
      if (currentP > 99) currentP = 99;
      setExtractProgress(Math.floor(currentP))
    }, 200)

    const form = new FormData()
    form.append('file', file)
    
    try {
      // Force minimum 10 seconds delay so the animation plays fully
      const minDelay = new Promise(r => setTimeout(r, 10000));
      const uploadReq = axios.post(`${API}/api/upload-resume`, form);
      
      const [, res] = await Promise.all([minDelay, uploadReq])
      
      setResumeText(res.data.text)
      setFileName(res.data.filename)
      
      // Complete progress to 100
      clearInterval(interval)
      setExtractProgress(100)
      
      setTimeout(() => {
        setStep('role')
      }, 1000)

    } catch (e) {
      clearInterval(interval)
      setError(e.response?.data?.detail || 'Upload failed. Try pasting your resume text below.')
      setStep('upload')
    }
    setUploading(false)
  }, [setResumeText, setFileName, setJobRole, setJobDesc])

  const handleAnalyze = async () => {
    if (!jobRole.trim()) { setError('Please select or type a job role.'); return }
    if (!resumeText.trim() || resumeText.trim().length < 80) { setError('Resume text too short. Please upload a proper resume.'); return }
    setError('')
    setAnalyzing(true)

    // Cycle through steps with timing (original standard duration)
    let i = 0
    setAnalyzeStep(LOADING_STEPS[0].label)
    const cycleStep = () => {
      i++
      if (i < LOADING_STEPS.length) {
        setAnalyzeStep(LOADING_STEPS[i].label)
        setTimeout(cycleStep, LOADING_STEPS[i].duration)
      }
    }
    setTimeout(cycleStep, LOADING_STEPS[0].duration)

    const form = new FormData()
    form.append('resume_text', resumeText)
    form.append('job_role', jobRole)
    if (jobDesc.trim()) form.append('job_description', jobDesc)

    try {
      const res = await axios.post(`${API}/api/analyze`, form)
      // Small delay so last step shows
      await new Promise(r => setTimeout(r, 600))
      setResults(res.data)
      nav('/results')
    } catch (e) {
      setError(e.response?.data?.detail || 'Analysis failed. Make sure backend is running on port 8000.')
      setAnalyzing(false)
      setAnalyzeStep('')
    }
  }

  // Pure original loading screen renders during analysis
  if (analyzing) return <LoadingScreen currentStep={analyzeStep} />

  if (!introFinished) {
    return (
      <AnimatePresence>
        <motion.div 
          key="intro"
          style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', zIndex: 100 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8, y: 30, filter: 'blur(15px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 800, textAlign: 'center', color: 'var(--text)', padding: 24, lineHeight: 1.2 }}
          >
            Are you ready to level up<br/>
            <span style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>your CV?</span>
          </motion.h1>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      style={{ maxWidth: step === 'extracting' ? 1400 : 840, margin: '0 auto', padding: '48px 24px 80px' }}
      layout
    >
      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48, maxWidth: 840, margin: '0 auto 48px' }}>
        {['Upload Resume', 'Job Details', 'Get Results'].map((label, i) => {
          const done   = step === 'role' && i === 0
          const active = ((step === 'upload' || step === 'extracting') && i === 0) || (step === 'role' && i === 1)
          const future = ((step === 'upload' || step === 'extracting') && i > 0) || (step === 'role' && i > 1)
          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
                <div className="step-dot" style={{
                  background: done ? 'var(--green)' : active ? 'var(--accent)' : 'var(--bg3)',
                  color: done || active ? '#fff' : 'var(--text3)',
                  border: active ? '2px solid var(--accent2)' : '1px solid var(--border)',
                  boxShadow: active ? '0 0 16px rgba(108,99,255,0.4)' : 'none'
                }}>
                  {done ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 12, color: active ? 'var(--text)' : 'var(--text3)', whiteSpace: 'nowrap', fontFamily: 'var(--font-display)', fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
              {i < 2 && <div className="step-line" style={{ background: done ? 'var(--green)' : 'var(--border)' }} />}
            </div>
          )
        })}
      </div>

      {/* ── UPLOAD OR EXTRACTING STEP ── */}
      {(step === 'upload' || step === 'extracting') && (
        <div className="fade-up">
          {step === 'upload' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36, maxWidth: 840, margin: '0 auto' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Upload your resume</h1>
                <p style={{ fontSize: 16, color: 'var(--text2)' }}>PDF, DOCX, or TXT • Max 5MB • Safe & secure</p>
              </div>
            </div>
          )}

          <div style={step === 'extracting' ? { display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) minmax(400px, 520px) minmax(250px, 1fr)', gap: '48px', alignItems: 'center' } : { maxWidth: 840, margin: '0 auto' }}>
             
             {/* Left Column (Only in extracting) */}
             {step === 'extracting' && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <StickmanStory progress={extractProgress} />
                </div>
             )}

             {/* Middle Column (Upload box) */}
             <div style={{ width: '100%' }}>
                <div
                   onClick={() => !uploading && fileRef.current.click()}
                   onDrop={e => { e.preventDefault(); setDragOver(false); if (!uploading) handleFile(e.dataTransfer.files[0]) }}
                   onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                   onDragLeave={() => setDragOver(false)}
                   style={{
                      border: `2px dashed ${dragOver ? 'var(--accent)' : 'var(--border2)'}`,
                      borderRadius: 20, padding: '56px 32px', textAlign: 'center', cursor: uploading ? 'default' : 'pointer',
                      background: dragOver ? 'rgba(108,99,255,0.05)' : 'var(--bg2)',
                      transition: 'all 0.2s ease', 
                      marginBottom: step === 'extracting' ? 0 : 28
                   }}
                >
                   <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }}
                     onChange={e => handleFile(e.target.files[0])} />

                   {uploading ? (
                     <div>
                       <div style={{ width: 52, height: 52, margin: '0 auto 20px', border: '3px solid var(--border2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                       <p style={{ fontSize: 16, color: 'var(--text2)' }}>Genuine AI is parsing your resume...</p>
                     </div>
                   ) : (
                     <div>
                        <div style={{
                          width: 72, height: 72, borderRadius: 18, margin: '0 auto 22px',
                          background: 'var(--blue-bg)', border: '1px solid var(--blue-border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32
                        }}>📄</div>
                        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 8, color: 'var(--text)' }}>
                          {dragOver ? 'Drop it here!' : 'Drag & drop your resume'}
                        </p>
                        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 22 }}>or click to browse files</p>
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          {['pdf','docx','txt'].map(t => (
                            <span key={t} style={{ padding: '6px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 7, fontSize: 14, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>.{t}</span>
                          ))}
                        </div>
                     </div>
                   )}
                </div>
             </div>

             {/* Right Column (Only in extracting) */}
             {step === 'extracting' && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px', height: '300px' }}>
                    <div style={{ fontSize: '14px', color: 'var(--accent2)', fontWeight: 600, letterSpacing: '1px', marginBottom: '16px', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
                      EXTRACTION PROGRESS
                    </div>
                    
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '80px', fontWeight: 900, color: extractProgress >= 95 ? 'var(--green)' : 'var(--text)', lineHeight: 1, display: 'flex', alignItems: 'flex-start' }}>
                      {Math.min(extractProgress, 100)}<span style={{ fontSize: '32px', marginTop: '12px' }}>%</span>
                    </div>

                    <p style={{ fontSize: '14px', color: 'var(--text3)', textAlign: 'center', marginTop: '24px' }}>
                      {extractProgress < 100 ? "Validating keywords..." : "Ready to proceed!"}
                    </p>
                  </div>
                </div>
             )}
          </div>

          {step === 'upload' && (
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
              {/* Divider */}
              <div style={{ position: 'relative', textAlign: 'center', marginBottom: 28 }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }} />
                <span style={{ position: 'relative', background: 'var(--bg)', padding: '0 18px', fontSize: 14, color: 'var(--text3)' }}>or paste resume text directly</span>
              </div>

              <textarea rows={9} value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder={`Paste your full resume text here...\n\nName, contact info, skills, education, projects, experience — everything.`}
                style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.75, resize: 'vertical', marginBottom: 16 }}
              />

              {error && <div style={{ padding: '14px 18px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 10, fontSize: 14, color: 'var(--red)', marginBottom: 16 }}>⚠️ {error}</div>}

              {resumeText.trim().length > 100 && (
                <button className="btn-primary" onClick={() => { setFileName('Pasted text'); setJobRole(''); setJobDesc(''); setStep('role') }} style={{ width: '100%' }}>
                  Continue with this text →
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── ROLE STEP ── */}
      {step === 'role' && (
        <div className="fade-up" style={{ maxWidth: 840, margin: '0 auto' }}>
          {/* File indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--green-bg)', border: '1px solid var(--green-border)', borderRadius: 12, marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>{fileName || 'Resume text ready'}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{resumeText.split(/\s+/).filter(Boolean).length} words extracted successfully</div>
              </div>
            </div>
            <button className="btn-ghost" style={{ fontSize: 13, padding: '7px 16px' }} onClick={() => setStep('upload')}>Change</button>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>What role are you targeting?</h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 32 }}>We use real keyword databases per role. Add a JD for laser-accurate matching.</p>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 14, color: 'var(--text2)', display: 'block', marginBottom: 8, fontWeight: 500 }}>Target Job Role *</label>
            <input value={jobRole} onChange={e => setJobRole(e.target.value)}
              placeholder="e.g. Data Analyst, MIS Executive, Business Analyst..." style={{ fontSize: 16 }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
            {QUICK_ROLES.map(r => (
              <button key={r} onClick={() => setJobRole(r)} style={{
                padding: '8px 18px', borderRadius: 100, fontSize: 15,
                background: jobRole === r ? 'var(--accent)' : 'var(--bg3)',
                color: jobRole === r ? '#fff' : 'var(--text2)',
                border: `1px solid ${jobRole === r ? 'var(--accent)' : 'var(--border2)'}`,
                fontFamily: 'var(--font-display)', fontWeight: 500,
                boxShadow: jobRole === r ? '0 0 12px rgba(108,99,255,0.4)' : 'none'
              }}>{r}</button>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 15, display: 'block', marginBottom: 4, fontWeight: 500 }}>
              Job Description <span style={{ color: 'var(--accent2)', fontWeight: 400 }}>(recommended — boosts accuracy)</span>
            </label>
            <p style={{ fontSize: 14, color: 'var(--text3)', marginBottom: 10 }}>Paste the actual JD → we extract exact keywords → much higher accuracy</p>
            <textarea rows={7} value={jobDesc} onChange={e => setJobDesc(e.target.value)}
              placeholder={`Paste the job description here...\n\ne.g. "We are looking for a Data Analyst with 0–2 years experience.\nMust have SQL, Python, Power BI skills, strong analytical thinking..."`}
              style={{ fontSize: 15, lineHeight: 1.75, resize: 'vertical' }}
            />
          </div>

          {error && <div style={{ padding: '14px 18px', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 10, fontSize: 14, color: 'var(--red)', marginBottom: 16 }}>⚠️ {error}</div>}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-ghost" onClick={() => setStep('upload')}>← Back</button>
            <button className="btn-primary" onClick={handleAnalyze} style={{ flex: 1 }}>
              Analyze My Resume →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}