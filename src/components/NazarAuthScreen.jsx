import { useState, useEffect } from 'react'

/**
 * NazarAuthScreen — immersive branded login/signup wrapper
 * Features animated eye, floating particles, stats ticker, and testimonials
 */

/* Animated floating dot */
function FloatingDot({ delay, x, y, size, color }) {
  return (
    <div
      className="absolute rounded-full opacity-0"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        animation: `floatDot 6s ${delay}s ease-in-out infinite`,
      }}
    />
  )
}

/* Animated eye SVG hero */
function AnimatedEye() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(10,110,110,0.15) 0%, transparent 70%)',
          animation: 'eyePulse 3s ease-in-out infinite',
        }}
      />
      {/* Scanning ring */}
      <div
        className="absolute inset-2 rounded-full border-2 border-teal-deep/20"
        style={{ animation: 'scanRing 4s ease-in-out infinite' }}
      />
      <div
        className="absolute inset-4 rounded-full border border-amber-warm/20"
        style={{ animation: 'scanRing 4s 1s ease-in-out infinite' }}
      />
      {/* Main eye */}
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-xl">
        {/* Outer eye shape */}
        <ellipse
          cx="60" cy="60" rx="50" ry="28"
          fill="none" stroke="#0A6E6E" strokeWidth="2.5"
          style={{ animation: 'eyeBlink 5s ease-in-out infinite' }}
        />
        {/* Iris gradient */}
        <defs>
          <radialGradient id="irisGrad" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#12ABAB" />
            <stop offset="50%" stopColor="#0A6E6E" />
            <stop offset="100%" stopColor="#065656" />
          </radialGradient>
          <radialGradient id="glowGrad" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Iris */}
        <circle cx="60" cy="60" r="18" fill="url(#irisGrad)" style={{ animation: 'irisPulse 3s ease-in-out infinite' }} />
        {/* Pupil */}
        <circle cx="60" cy="60" r="7" fill="#1A1A2E" />
        {/* Light reflection */}
        <circle cx="55" cy="55" r="3" fill="white" opacity="0.8" />
        <circle cx="65" cy="63" r="1.5" fill="white" opacity="0.5" />
        {/* AI scan line */}
        <line
          x1="10" y1="60" x2="110" y2="60"
          stroke="#F5A623" strokeWidth="1" opacity="0.4"
          strokeDasharray="4 6"
          style={{ animation: 'scanLine 3s linear infinite' }}
        />
        {/* Corner brackets - AI detection */}
        <path d="M20 42 L20 35 L30 35" stroke="#0A6E6E" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M100 42 L100 35 L90 35" stroke="#0A6E6E" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M20 78 L20 85 L30 85" stroke="#0A6E6E" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M100 78 L100 85 L90 85" stroke="#0A6E6E" strokeWidth="1.5" fill="none" opacity="0.5" />
      </svg>
    </div>
  )
}

/* Impact stat counter */
function StatCounter({ value, label, suffix = '' }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 2000
    const stepTime = Math.max(16, duration / end)
    const increment = Math.ceil(end / (duration / stepTime))

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="text-center">
      <p className="font-display font-bold text-xl text-white leading-none">
        {count.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-[11px] text-teal-pale/80 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

/* Rotating testimonial */
const testimonials = [
  { text: 'Caught my DR early. My vision is saved.', person: 'Lakshmi, Dharwad', lang: 'en' },
  { text: 'गाँव में ही आँखों की जाँच हो गई!', person: 'Ramesh, Jaipur', lang: 'hi' },
  { text: 'ನನ್ನ ಕಣ್ಣುಗಳ ರಕ್ಷಣೆ ಆಯಿತು', person: 'Kavitha, Mysore', lang: 'kn' },
  { text: 'Free screening saved my father\'s eyesight', person: 'Priya, Chennai', lang: 'en' },
]

function TestimonialCarousel() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 4000)
    return () => clearInterval(t)
  }, [])

  const item = testimonials[idx]

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 min-h-[68px] flex items-center">
      <div className="flex items-start gap-3 w-full animate-fade-up" key={idx}>
        <div className="w-8 h-8 bg-amber-warm/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-white/90 text-sm font-body leading-snug">"{item.text}"</p>
          <p className="text-teal-pale/60 text-[11px] mt-1">— {item.person}</p>
        </div>
      </div>
    </div>
  )
}

export default function NazarAuthScreen({ children }) {
  const dots = [
    { delay: 0, x: 10, y: 15, size: 6, color: 'rgba(10,110,110,0.3)' },
    { delay: 1.5, x: 85, y: 20, size: 8, color: 'rgba(245,166,35,0.25)' },
    { delay: 0.8, x: 25, y: 75, size: 5, color: 'rgba(76,175,80,0.3)' },
    { delay: 2.2, x: 75, y: 80, size: 7, color: 'rgba(10,110,110,0.2)' },
    { delay: 3, x: 50, y: 10, size: 4, color: 'rgba(245,166,35,0.2)' },
    { delay: 1, x: 90, y: 55, size: 6, color: 'rgba(10,110,110,0.15)' },
    { delay: 2.8, x: 5, y: 50, size: 5, color: 'rgba(76,175,80,0.2)' },
  ]

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col bg-gradient-to-b from-[#063e3e] via-teal-deep to-[#084848] relative overflow-hidden">
      {/* Floating particles */}
      {dots.map((d, i) => <FloatingDot key={i} {...d} />)}

      {/* Decorative top arc */}
      <div className="absolute top-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-[50%] opacity-[0.07]"
          style={{ background: 'radial-gradient(ellipse, #12ABAB 0%, transparent 70%)' }}
        />
      </div>

      {/* Hero section */}
      <div className="flex-shrink-0 px-6 pt-10 pb-4 relative z-10">
        <AnimatedEye />

        {/* Brand */}
        <div className="text-center mb-5">
          <h1 className="font-display text-display-lg font-bold text-white tracking-tight leading-none">
            Nazar AI
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="h-px w-8 bg-amber-warm/40" />
            <p className="font-body text-amber-warm text-sm font-medium tracking-wide">
              Protecting Your Eyes
            </p>
            <div className="h-px w-8 bg-amber-warm/40" />
          </div>
        </div>

        {/* Hindi inspirational quote */}
        <p className="text-center text-amber-warm/90 text-sm font-display font-semibold mb-2 italic">
          "आँखों से प्यार झलकना चाहिए, बीमारी नहीं"
        </p>

        {/* Key message */}
        <p className="text-center text-teal-pale/80 text-sm font-body max-w-[280px] mx-auto leading-relaxed mb-5">
          AI-powered diabetic retinopathy screening.
          <span className="text-white font-semibold"> 30-second scan. </span>
          Protect your vision before it's too late.
        </p>

        {/* Impact stats */}
        <div className="flex justify-center gap-6 mb-5">
          <StatCounter value={89} suffix="M" label="Diabetics in India" />
          <div className="w-px bg-white/15 self-stretch" />
          <StatCounter value={43} suffix="%" label="Undiagnosed" />
          <div className="w-px bg-white/15 self-stretch" />
          <StatCounter value={90} suffix="%" label="Blindness Preventable" />
        </div>

        {/* Testimonial */}
        <TestimonialCarousel />
      </div>

      {/* Auth form - slides up from bottom */}
      <div className="flex-1 flex flex-col mt-4 relative z-10">
        <div
          className="flex-1 bg-ivory rounded-t-[2rem] px-5 pt-6 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
          style={{ animation: 'slideUp 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          {/* Drag indicator */}
          <div className="w-10 h-1 bg-ink/10 rounded-full mx-auto mb-4" />

          <div>
            {children}
          </div>

          {/* Footer */}
          <div className="mt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[11px] text-ink-muted">End-to-end encrypted • HIPAA compliant</span>
            </div>
            <p className="text-[10px] text-ink-muted/60">
              AWS AI for Bharat • Made in India 🇮🇳
            </p>
            <p className="text-[10px] text-ink-muted/60">
              Built by{' '}
              <a href="https://health.gheware.com" target="_blank" rel="noopener noreferrer" className="text-teal-deep hover:underline">
                Gheware
              </a>{' '}
              with <span className="text-kumkum-red">&#10084;</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatDot {
          0%, 100% { opacity: 0; transform: translateY(0) scale(1); }
          25% { opacity: 1; }
          50% { opacity: 0.6; transform: translateY(-30px) scale(1.5); }
          75% { opacity: 0.3; }
        }
        @keyframes eyePulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes scanRing {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        @keyframes irisPulse {
          0%, 100% { r: 18; }
          50% { r: 20; }
        }
        @keyframes eyeBlink {
          0%, 42%, 48%, 100% { ry: 28; }
          45% { ry: 2; }
        }
        @keyframes scanLine {
          0% { transform: translateY(-15px); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        @keyframes slideUp {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
