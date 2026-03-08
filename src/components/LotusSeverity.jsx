/**
 * Lotus Severity Indicator
 * 0 petals = No DR (green)
 * 1 petal = Mild (amber)
 * 2 petals = Moderate (amber-deep)
 * 3 petals = Severe (kumkum)
 * 4 petals = Proliferative (kumkum-dark)
 */
export default function LotusSeverity({ petals = 0, size = 80, animate = true }) {
  const colors = ['#4CAF50', '#F5A623', '#E09000', '#D32F2F', '#B71C1C']
  const color = colors[petals] || colors[0]
  const centerColor = petals === 0 ? '#4CAF50' : petals <= 2 ? '#F5A623' : '#D32F2F'

  const petalPaths = [
    'M40 10 C50 20 55 30 40 38 C25 30 30 20 40 10Z',     // top
    'M70 30 C60 40 50 45 42 38 C50 25 60 20 70 30Z',     // right
    'M60 65 C50 55 45 50 42 42 C55 45 60 55 60 65Z',     // bottom-right
    'M20 65 C30 55 35 50 38 42 C25 45 20 55 20 65Z',     // bottom-left
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      role="img"
      aria-label={`Severity level: ${petals} out of 4`}
    >
      {/* Outer glow for severity */}
      {petals > 0 && (
        <circle cx="40" cy="40" r="38" fill="none" stroke={color} strokeWidth="1" opacity="0.2" />
      )}

      {/* Petals */}
      {petalPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={i < petals ? color : '#E8E4DD'}
          opacity={i < petals ? 1 : 0.3}
          className={animate && i < petals ? 'animate-petal-grow' : ''}
          style={animate ? { animationDelay: `${i * 150}ms` } : {}}
        />
      ))}

      {/* Center */}
      <circle cx="40" cy="40" r="8" fill={centerColor} opacity="0.9" />
      <circle cx="40" cy="40" r="4" fill="white" opacity="0.6" />
    </svg>
  )
}
