import { useState, useEffect } from 'react'

/**
 * Marigold flowers falling celebration animation for "No DR" result
 */
export default function MarigoldCelebration({ active }) {
  const [petals, setPetals] = useState([])

  useEffect(() => {
    if (!active) return
    const newPetals = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      size: 12 + Math.random() * 16,
      duration: 2.5 + Math.random() * 2,
    }))
    setPetals(newPetals)
    const timer = setTimeout(() => setPetals([]), 5000)
    return () => clearTimeout(timer)
  }, [active])

  if (!petals.length) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50" aria-hidden="true">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            animation: `marigoldFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          <svg width={p.size} height={p.size} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" fill="#F5A623" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={angle}
                cx="12"
                cy="4"
                rx="3"
                ry="5"
                fill={angle % 90 === 0 ? '#FF9800' : '#FFC107'}
                transform={`rotate(${angle} 12 12)`}
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  )
}
