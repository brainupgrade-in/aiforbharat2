import { useState, useRef, useCallback, useEffect } from 'react'
import { t } from '../lib/i18n'
import IrisLoader from '../components/IrisLoader'

export default function NazarScan({ lang, onResult }) {
  const [step, setStep] = useState(1) // 1=photo, 2=analyzing
  const [patientId, setPatientId] = useState('')
  const [preview, setPreview] = useState(null)
  const [photoQuality, setPhotoQuality] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const [cameraError, setCameraError] = useState(null)

  const fileRef = useRef()
  const videoRef = useRef()
  const streamRef = useRef(null)
  const canvasRef = useRef()

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [])

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setShowCamera(false)
  }

  const startCamera = async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setShowCamera(true)
      // Wait for DOM to render video element
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access.'
        : 'Could not access camera. Try uploading a photo instead.')
      // Fallback: open file picker with capture
      fileRef.current?.click()
    }
  }

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setPreview(dataUrl)
    stopCamera()
    // Simulate quality check
    setTimeout(() => setPhotoQuality(Math.random() > 0.15 ? 'good' : 'bad'), 800)
  }

  const handleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setPhotoQuality(null)
      setTimeout(() => setPhotoQuality(Math.random() > 0.15 ? 'good' : 'bad'), 800)
    }
    // Reset file input so same file can be re-selected
    if (e.target) e.target.value = ''
  }, [])

  const handleRetake = () => {
    setPreview(null)
    setPhotoQuality(null)
  }

  const handleSendForScan = () => {
    setStep(2)
    setTimeout(() => {
      const severity = Math.random() > 0.6 ? 0 : Math.ceil(Math.random() * 4)
      const confidence = (85 + Math.random() * 13).toFixed(1)
      onResult({
        severity,
        confidence: parseFloat(confidence),
        patientId: patientId || 'Patient',
        findings: {
          ma: severity > 0 ? Math.ceil(Math.random() * 8) : 0,
          he: severity > 1,
          nve: severity > 2,
          neovasc: severity > 3,
        },
      })
    }, 3000)
  }

  const stepLabels = [t('step1', lang), t('step2', lang), t('step3', lang)]

  return (
    <div className="space-y-5 animate-fade-up">
      <h1 className="font-display text-heading font-bold text-teal-deep">{t('scanTitle', lang)}</h1>

      {/* Hidden canvas for camera capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input for gallery upload */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t('takePhoto', lang)}
      />

      {/* Step indicator */}
      <div className="flex items-center gap-2" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3}>
        {stepLabels.map((label, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full h-1.5 rounded-full transition-colors duration-300 ${
              i + 1 <= step ? 'bg-teal-deep' : 'bg-ivory-dark'
            }`} />
            <span className={`text-[11px] font-medium ${
              i + 1 <= step ? 'text-teal-deep' : 'text-ink-muted'
            }`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          {/* Patient ID */}
          <div>
            <label className="block text-caption font-medium text-ink-light mb-1.5" htmlFor="patient-id">
              {t('patientId', lang)}
            </label>
            <input
              id="patient-id"
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g., Ramesh / 4832"
              className="input-nazar"
            />
          </div>

          {/* Camera / Preview */}
          <div className="card-warm">
            <h2 className="font-display font-semibold text-ink mb-2">{t('captureFundus', lang)}</h2>
            <p className="text-caption text-ink-muted mb-4">{t('positionGuide', lang)}</p>

            {/* Live camera view */}
            {showCamera && (
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square max-h-72 mx-auto mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Guide circle overlay on live camera */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 opacity-50">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#12ABAB" strokeWidth="2" strokeDasharray="8 4" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#12ABAB" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="100" y1="10" x2="100" y2="40" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="100" y1="160" x2="100" y2="190" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="10" y1="100" x2="40" y2="100" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="160" y1="100" x2="190" y2="100" stroke="#12ABAB" strokeWidth="0.5" />
                  </svg>
                </div>
                {/* Capture button overlay */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={captureFromCamera}
                    className="w-16 h-16 bg-white rounded-full border-4 border-teal-deep flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    aria-label={t('takePhoto', lang)}
                  >
                    <div className="w-12 h-12 bg-teal-deep rounded-full" />
                  </button>
                  <button
                    onClick={stopCamera}
                    className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg"
                    aria-label="Close camera"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Preview of captured/uploaded image */}
            {!showCamera && preview && (
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square max-h-72 mx-auto mb-4">
                <img src={preview} alt="Fundus capture" className="w-full h-full object-cover" />
                {/* Quality badge */}
                {photoQuality && (
                  <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-body font-semibold text-sm ${
                    photoQuality === 'good'
                      ? 'bg-mango-green text-white'
                      : 'bg-kumkum-red text-white'
                  }`}>
                    {photoQuality === 'good' ? t('photoOk', lang) : t('photoRetake', lang)}
                  </div>
                )}
                {/* Retake button */}
                <button
                  onClick={handleRetake}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow"
                  aria-label="Retake"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              </div>
            )}

            {/* Empty state with guide circle */}
            {!showCamera && !preview && (
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square max-h-72 mx-auto mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 opacity-40">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#12ABAB" strokeWidth="2" strokeDasharray="8 4" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#12ABAB" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="100" y1="10" x2="100" y2="40" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="100" y1="160" x2="100" y2="190" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="10" y1="100" x2="40" y2="100" stroke="#12ABAB" strokeWidth="0.5" />
                    <line x1="160" y1="100" x2="190" y2="100" stroke="#12ABAB" strokeWidth="0.5" />
                  </svg>
                </div>
              </div>
            )}

            {/* Camera error */}
            {cameraError && (
              <div className="bg-amber-light rounded-xl p-3 mb-3">
                <p className="text-caption text-ink-light">{cameraError}</p>
              </div>
            )}

            {/* Action buttons (shown when camera is NOT active) */}
            {!showCamera && (
              <div className="flex gap-3">
                <button
                  onClick={startCamera}
                  className="btn-teal flex-1 gap-2"
                  aria-label={t('takePhoto', lang)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  {t('takePhoto', lang)}
                </button>
                <button
                  onClick={() => {
                    const el = document.createElement('input')
                    el.type = 'file'
                    el.accept = 'image/*'
                    el.onchange = handleFileChange
                    el.click()
                  }}
                  className="btn-outline flex-1 gap-2"
                  aria-label={t('uploadPhoto', lang)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  {t('uploadPhoto', lang)}
                </button>
              </div>
            )}
          </div>

          {/* Send for AI scan */}
          {preview && photoQuality === 'good' && (
            <button
              onClick={handleSendForScan}
              className="btn-amber w-full text-lg gap-2 animate-fade-up"
              aria-label={t('sendForScan', lang)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              {t('sendForScan', lang)}
            </button>
          )}
        </>
      )}

      {/* Analyzing state */}
      {step === 2 && (
        <div className="flex flex-col items-center py-12 animate-fade-up">
          <IrisLoader size={96} />
          <p className="font-display font-bold text-teal-deep text-heading mt-6 animate-heartbeat">
            {t('analyzing', lang)}
          </p>
          <p className="text-ink-muted text-caption mt-2">{t('estimatedWait', lang)}</p>
          <div className="mt-8 opacity-20">
            <svg width="200" height="40" viewBox="0 0 200 40">
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx={20 + i * 40}
                  cy="20"
                  r="12"
                  fill="none"
                  stroke="#0A6E6E"
                  strokeWidth="1"
                  className="animate-heartbeat"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}
