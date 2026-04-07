import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileText, Cpu, Sparkles, Wand2 } from 'lucide-react';

export default function StoryAnimation() {
  const [phase, setPhase] = useState(0);

  // Animation cycle sequence
  useEffect(() => {
    const cycle = async () => {
      while (true) {
        setPhase(0); // Start - doc on left
        await new Promise(r => setTimeout(r, 1000));
        setPhase(1); // Moving into scanner
        await new Promise(r => setTimeout(r, 2000));
        setPhase(2); // Scanning... tooltip appears
        await new Promise(r => setTimeout(r, 3500));
        setPhase(3); // Result low score
        await new Promise(r => setTimeout(r, 2000));
        setPhase(4); // Translating to right
        await new Promise(r => setTimeout(r, 1500));
        setPhase(5); // In AI Fixer
        await new Promise(r => setTimeout(r, 2500));
        setPhase(6); // Success high score
        await new Promise(r => setTimeout(r, 3500));
      }
    };
    cycle();
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0, // Behind the text
      opacity: 0.8
    }}>
      {/* ── LEFT SIDE: ATS Scanner ── */}
      <div style={{
        position: 'absolute',
        left: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Scanner Machine */}
        <div style={{
          width: '180px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: '80px'
        }}>
          <Cpu color="var(--text3)" size={40} />
          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '2px' }}>
            ATS SCANNER
          </div>

          {/* Scanner Light Beam */}
          <motion.div
            style={{
              position: 'absolute',
              top: '20px',
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--accent2), transparent)',
              boxShadow: '0 0 10px var(--accent2)'
            }}
            animate={phase === 1 || phase === 2 ? { y: [0, 160, 0] } : { opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Tooltip during scanning */}
        <motion.div
          style={{
            position: 'absolute',
            top: '0px',
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--text2)',
            textAlign: 'center',
            width: '240px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            lineHeight: 1.5
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase === 2 ? 1 : 0, y: phase === 2 ? 0 : 10 }}
          transition={{ duration: 0.3 }}
        >
          Extracting genuinely... ⏱️<br/>
          <span style={{ color: 'var(--text3)', fontSize: '11px' }}>We respect your skills, this takes a few seconds.</span>
        </motion.div>
      </div>

      {/* ── RIGHT SIDE: AI Fixer ── */}
      <div style={{
        position: 'absolute',
        right: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* AI Machine */}
        <div style={{
          width: '180px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: '80px',
          boxShadow: phase === 5 ? '0 0 40px rgba(108,99,255,0.2)' : 'none',
          transition: 'box-shadow 0.5s ease'
        }}>
          <Wand2 color={phase === 5 ? 'var(--blue)' : 'var(--text3)'} size={40} />
          <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text3)', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '2px' }}>
            AI FIXER
          </div>

          {/* Magical Sparkles */}
          <motion.div
            style={{ position: 'absolute' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: phase === 5 ? 1 : 0, scale: phase === 5 ? 1 : 0, rotate: phase === 5 ? 180 : 0 }}
            transition={{ duration: 2 }}
          >
            <Sparkles color="var(--blue)" size={80} style={{ opacity: 0.3 }} />
          </motion.div>
        </div>
      </div>

      {/* ── THE DOCUMENT ── */}
      <motion.div
        style={{
          position: 'absolute',
          width: '60px',
          height: '80px',
          background: 'var(--bg3)',
          border: '1px solid var(--border2)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          // Initial position is above scanner
          left: 'calc(8% + 150px - 30px)',
          top: '30%'
        }}
        animate={
          phase === 0 ? { left: 'calc(8% + 120px)', top: '15vh', opacity: 1, scale: 1 } :
          phase === 1 ? { left: 'calc(8% + 120px)', top: 'calc(50vh - 20px)', opacity: 0.5, scale: 0.9 } :
          phase === 2 ? { left: 'calc(8% + 120px)', top: 'calc(50vh - 20px)', opacity: 0.5, scale: 0.9 } :
          phase === 3 ? { left: 'calc(8% + 120px)', top: 'calc(50vh + 150px)', opacity: 1, scale: 1 } :
          phase === 4 ? { left: 'calc(92% - 180px)', top: 'calc(50vh + 150px)', opacity: 1, scale: 1 } :
          phase === 5 ? { left: 'calc(92% - 180px)', top: 'calc(50vh - 20px)', opacity: 0.5, scale: 0.9 } :
          phase === 6 ? { left: 'calc(92% - 180px)', top: '15vh', opacity: 1, scale: 1.1, boxShadow: '0 0 30px rgba(32,201,151,0.4)', borderColor: 'var(--green)' } : {}
        }
        transition={{ 
          duration: phase === 4 ? 1.5 : 0.6, 
          ease: "easeInOut" 
        }}
      >
        <FileText size={24} color={phase >= 6 ? 'var(--green)' : 'var(--text2)'} />
        
        {/* Face / Result Badge on Document */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-12px',
            background: 'var(--bg2)',
            border: '1px solid',
            borderColor: phase >= 6 ? 'var(--green)' : 'var(--red)',
            borderRadius: '20px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: phase === 3 || phase === 4 ? 1 : (phase === 6 ? 1 : 0),
            scale: phase === 3 || phase === 4 ? 1 : (phase === 6 ? 1 : 0)
          }}
        >
          {phase < 5 ? (
            <><span style={{ fontSize: '14px' }}>😔</span> 30%</>
          ) : (
            <><span style={{ fontSize: '14px' }}>🤩</span> 98%</>
          )}
        </motion.div>
      </motion.div>

      {/* ── PATH (Dotted line from Scanner to AI) ── */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -1
        }}
      >
        <motion.path
          d="M 250 calc(50vh + 190px) Q 50vw calc(50vh + 250px) calc(100vw - 250px) calc(50vh + 190px)"
          fill="transparent"
          stroke="var(--border2)"
          strokeWidth="2"
          strokeDasharray="8 8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: phase >= 3 ? 1 : 0,
            opacity: phase >= 3 && phase <= 5 ? 0.3 : 0
          }}
          transition={{ duration: 1 }}
        />
      </svg>
    </div>
  );
}
