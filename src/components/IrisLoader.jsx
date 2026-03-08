/**
 * Iris Loading Spinner — concentric rings animating inward
 */
export default function IrisLoader({ size = 64, className = '' }) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }} role="status" aria-label="Loading">
      <svg width={size} height={size} viewBox="0 0 64 64" className="animate-iris-spin">
        {/* Outer ring */}
        <circle cx="32" cy="32" r="30" fill="none" stroke="#0A6E6E" strokeWidth="2" opacity="0.2" />
        {/* Middle rings */}
        <circle cx="32" cy="32" r="24" fill="none" stroke="#0A6E6E" strokeWidth="1.5" opacity="0.3"
          strokeDasharray="12 6" />
        <circle cx="32" cy="32" r="18" fill="none" stroke="#0E8C8C" strokeWidth="1.5" opacity="0.4"
          strokeDasharray="8 4" />
        <circle cx="32" cy="32" r="12" fill="none" stroke="#12ABAB" strokeWidth="2" opacity="0.5"
          strokeDasharray="6 3" />
        {/* Pupil */}
        <circle cx="32" cy="32" r="6" fill="#0A6E6E" opacity="0.8" className="animate-heartbeat" />
        <circle cx="32" cy="32" r="2.5" fill="white" opacity="0.6" />
      </svg>
    </div>
  )
}
