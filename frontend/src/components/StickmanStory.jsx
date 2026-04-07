import { motion } from 'framer-motion';
import { FileText, Wand2, Cpu } from 'lucide-react';

export default function StickmanStory({ progress }) {

  // Define states based on progress
  const isSad = progress < 60;
  const isFixing = progress >= 60 && progress < 95;
  const isHappy = progress >= 95;

  // Stickman Body Paths
  const bodyPath = "M 50 40 L 50 100"; // spine
  
  const armsPath = isSad ? "M 50 60 L 30 90 M 50 60 L 70 90" : // Arms down (sad)
                   isFixing ? "M 50 60 L 80 50 M 50 60 L 20 70" : // Running/Action arms
                   "M 50 60 L 20 20 M 50 60 L 80 20";             // Happy arms UP

  const legsPath = isFixing ? "M 50 100 L 20 120 M 50 100 L 80 140" : // Running legs
                   isHappy ? "M 50 100 L 30 130 M 50 100 L 70 130" :  // Jumping bent legs
                   "M 50 100 L 30 150 M 50 100 L 70 150";             // Normal standing legs

  const headY = isSad ? 10 : isHappy ? -15 : 0;
  
  // Scene positions
  const stickmanX = progress < 30 ? 50 : 
                    progress < 60 ? 150 : 
                    progress < 95 ? 250 : 350;

  let text = '';
  if (progress < 30) text = "Submitting raw resume to ATS...";
  else if (progress < 60) text = "ATS rejected: Missing keywords 😔";
  else if (progress < 95) text = "Running into CV Fixer AI Engine ✨";
  else text = "Resume Leveled UP! ATS Ready! 🤩";

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px', background: 'var(--bg2)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      
      {/* Background decorations */}
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '150px', background: 'rgba(108,99,255,0.05)', borderRight: '1px dashed var(--border2)' }}>
        <div style={{ position: 'absolute', bottom: '20px', left: '30px', opacity: 0.5 }}>
          <Cpu size={40} color="var(--text3)"/>
          <div style={{ fontSize: '10px', marginTop: '4px', color: 'var(--text3)' }}>ATS SCANNER</div>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '150px', background: 'rgba(32,201,151,0.05)', borderLeft: '1px dashed var(--border2)' }}>
        <div style={{ position: 'absolute', bottom: '20px', left: '40px', opacity: 0.5 }}>
          <Wand2 size={40} color="var(--green)"/>
          <div style={{ fontSize: '10px', marginTop: '4px', color: 'var(--green)' }}>AI FIXER</div>
        </div>
      </div>

      {/* The Story Text */}
      <motion.div 
        key={text}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600, color: isHappy ? 'var(--green)' : 'var(--text)', zIndex: 10, fontFamily: 'var(--font-display)' }}
      >
        {text}
      </motion.div>

      {/* Animation Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        
        {/* Stickman Container */}
        <motion.div
          animate={{ x: stickmanX, y: isHappy ? [0, -20, 0] : 0 }}
          transition={{ x: { duration: 1.5, ease: "easeInOut" }, y: { duration: 0.5, repeat: isHappy ? Infinity : 0 } }}
          style={{ position: 'absolute', top: '20px', left: '0px' }}
        >
          <svg width="100" height="160" viewBox="0 0 100 160">
            {/* Head */}
            <motion.circle 
              cx="50" cy="25" r="15" 
              fill="transparent" 
              stroke="var(--text)" 
              strokeWidth="4"
              animate={{ cy: 25 + headY }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
            {/* Sad/Happy Mouth */}
            <motion.path
                d={isHappy ? "M 42 27 Q 50 35 58 27" : isSad ? "M 42 32 Q 50 25 58 32" : "M 45 28 L 55 28"}
                stroke="var(--text)"
                strokeWidth="2"
                fill="transparent"
                strokeLinecap="round"
                animate={{ cy: 25 + headY }} // Tie to head movement
            />
            {/* Body */}
            <path d={bodyPath} stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
            {/* Arms */}
            <motion.path 
              d={armsPath} stroke="var(--text)" strokeWidth="4" strokeLinecap="round" fill="transparent"
              initial={false} animate={{ d: armsPath }} transition={{ type: "spring" }}
            />
            {/* Legs */}
            <motion.path 
              d={legsPath} stroke="var(--text)" strokeWidth="4" strokeLinecap="round" fill="transparent"
              initial={false} animate={{ d: legsPath }} transition={{ type: "spring" }}
            />
          </svg>

          {/* Stickman holding document */}
          <motion.div style={{ position: 'absolute', top: 40, left: 60 }}>
            <FileText size={32} color={isHappy ? 'var(--green)' : 'var(--text2)'} fill={isHappy ? 'rgba(32,201,151,0.2)' : 'none'} />
          </motion.div>
        </motion.div>
      </div>

    </div>
  )
}
