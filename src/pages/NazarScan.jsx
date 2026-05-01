import { useState, useRef, useCallback, useEffect } from 'react'
import { t } from '../lib/i18n'
import { useAuth } from '../lib/auth.jsx'
import { checkImageQuality } from '../lib/imageQuality'
import IrisLoader from '../components/IrisLoader'

const SCAN_URL = import.meta.env.VITE_SCAN_URL || '/api/scan'

const CLASS_TO_SEVERITY = {
  'No DR': 0,
  'Mild NPDR': 1,
  'Moderate NPDR': 2,
  'Severe NPDR': 3,
  'Proliferative DR': 4,
}

async function urlToBlob(url) {
  // Works for both data: URLs (camera capture) and blob: URLs (file upload)
  const r = await fetch(url)
  return r.blob()
}

export default function NazarScan({ lang, onResult, initialPatientId = '' }) {
  const { token } = useAuth()
  const [step, setStep] = useState(1)               // 1=photo, 2=upload+analyze
  const [phase, setPhase] = useState('idle')        // idle | uploading | analyzing
  const [uploadProgress, setUploadProgress] = useState(0)
  const [patientId, setPatientId] = useState(initialPatientId)
  const [preview, setPreview] = useState(null)
  const [photoQuality, setPhotoQuality] = useState(null)
  const [qualityReason, setQualityReason] = useState(null)   // 'too_small' | 'blurry' | null
  const [showCamera, setShowCamera] = useState(false)
  // Default to front camera — primary use case is the patient pointing the
  // phone at their own eye. ASHA workers / clinic users with a fundus lens
  // adapter can flip to the back camera with the in-frame button.
  const [cameraFacing, setCameraFacing] = useState('user')   // 'user' (front) | 'environment' (back)
  const [cameraError, setCameraError] = useState(null)
  const [error, setError] = useState(null)

  const fileRef = useRef()
  const videoRef = useRef()
  const streamRef = useRef(null)
  const canvasRef = useRef()

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

  const startCamera = async (facing) => {
    const desiredFacing = facing || cameraFacing
    const wasShown = showCamera
    setCameraError(null)
    // Tear down any existing stream first (needed when flipping)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: desiredFacing, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      setShowCamera(true)
      setCameraFacing(desiredFacing)
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      })
    } catch (err) {
      console.error('Camera error:', err)
      setCameraError(err.name === 'NotAllowedError'
        ? 'Camera permission denied. Please allow camera access.'
        : 'Could not access camera. Try uploading a photo instead.')
      // Only fall back to the file picker if this is the *initial* camera open;
      // a failed flip should keep the user inside the camera UI.
      if (!wasShown) fileRef.current?.click()
    }
  }

  const flipCamera = () => {
    startCamera(cameraFacing === 'environment' ? 'user' : 'environment')
  }

  const runQualityCheck = useCallback(async (src) => {
    setPhotoQuality(null)
    setQualityReason(null)
    const result = await checkImageQuality(src)
    setPhotoQuality(result.ok ? 'good' : 'bad')
    setQualityReason(result.reason)
  }, [])

  const captureFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setPreview(dataUrl)
    stopCamera()
    runQualityCheck(dataUrl)
  }

  const handleFileChange = useCallback((e) => {
    const file = e.target?.files?.[0]
    if (!file) {
      if (e.target) e.target.value = ''
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    runQualityCheck(url)
    if (e.target) e.target.value = ''
  }, [runQualityCheck])

  const handleRetake = () => {
    setPreview(null)
    setPhotoQuality(null)
    setQualityReason(null)
    setError(null)
  }

  const handleSendForScan = async () => {
    if (!preview || !token) return
    setStep(2)
    setPhase('uploading')
    setUploadProgress(0)
    setError(null)

    try {
      const blob = await urlToBlob(preview)
      const fd = new FormData()
      fd.append('image', blob, 'fundus.jpg')

      // XHR (not fetch) so we can hook the upload-progress event for the UI bar.
      const data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) {
            setUploadProgress(Math.round((ev.loaded / ev.total) * 100))
          }
        })
        xhr.upload.addEventListener('load', () => {
          setUploadProgress(100)
          setPhase('analyzing')
        })
        xhr.addEventListener('load', () => {
          let parsed = {}
          try { parsed = JSON.parse(xhr.responseText) } catch { /* keep empty */ }
          if (xhr.status >= 200 && xhr.status < 300) resolve(parsed)
          else reject(new Error(parsed.error || `Scan failed (${xhr.status})`))
        })
        xhr.addEventListener('error', () => reject(new Error('Network error')))
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')))
        xhr.open('POST', SCAN_URL)
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
        xhr.send(fd)
      })

      // Adapt API response → NazarResult-compatible shape (legacy: severity, confidence%)
      const severity = CLASS_TO_SEVERITY[data.classification] ?? 0
      onResult({
        scanId: data.id,
        severity,
        classification: data.classification,
        confidence: Math.round((data.confidence || 0) * 100),
        riskLevel: data.risk_level,
        hasDr: data.has_dr,
        pAnyDr: data.p_any_dr,
        probs: data.findings || {},
        recommendations: data.recommendations || [],
        patientId: patientId || 'Patient',
        inferenceMs: data.inference_ms,
      })
    } catch (e) {
      setError(e.message || 'Could not analyze image. Please try again.')
      setStep(1)
      setPhase('idle')
      setUploadProgress(0)
    }
  }

  const stepLabels = [t('step1', lang), t('step2', lang), t('step3', lang)]

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-heading font-bold text-teal-deep">{t('scanTitle', lang)}</h1>
      </div>

      {error && (
        <div className="bg-kumkum-light border-2 border-kumkum-red/40 rounded-xl px-3 py-2.5 text-caption text-kumkum-red">
          {error}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t('takePhoto', lang)}
      />

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

          <div className="card-warm">
            <h2 className="font-display font-semibold text-ink mb-2">{t('captureFundus', lang)}</h2>
            <p className="text-caption text-ink-muted mb-4">{t('positionGuide', lang)}</p>

            {showCamera && (
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square max-h-72 mx-auto mb-4">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
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
                <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-5">
                  <button
                    onClick={flipCamera}
                    className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    aria-label={cameraFacing === 'user' ? 'Switch to back camera' : 'Switch to front camera'}
                    title={cameraFacing === 'user' ? 'Front camera (tap for back)' : 'Back camera (tap for front)'}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 4v6h-6" />
                      <path d="M1 20v-6h6" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
                      <path d="M20.49 15A9 9 0 0 1 5.64 18.36L1 14" />
                    </svg>
                  </button>
                  <button
                    onClick={captureFromCamera}
                    className="w-16 h-16 bg-white rounded-full border-4 border-teal-deep flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                    aria-label={t('takePhoto', lang)}
                  >
                    <div className="w-12 h-12 bg-teal-deep rounded-full" />
                  </button>
                  <button onClick={stopCamera} className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-lg" aria-label="Close camera">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {!showCamera && preview && (
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-square max-h-72 mx-auto mb-4">
                <img src={preview} alt="Fundus capture" className="w-full h-full object-cover" />
                {photoQuality === 'good' && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full font-body font-semibold text-sm bg-mango-green text-white">
                    {t('photoOk', lang)}
                  </div>
                )}
                {photoQuality === 'bad' && (
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-2xl font-body font-medium text-[12px] bg-kumkum-red text-white text-center leading-snug">
                    {qualityReason === 'too_small' && t('photoTooSmall', lang)}
                    {qualityReason === 'blurry' && t('photoBlurry', lang)}
                    {!qualityReason && t('photoRetake', lang)}
                  </div>
                )}
                {photoQuality === null && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 text-ink-muted text-[11px] font-medium">
                    <span className="inline-block w-3 h-3 border-2 border-teal-deep border-t-transparent rounded-full animate-spin align-middle mr-2" />
                    Checking quality…
                  </div>
                )}
                <button onClick={handleRetake} className="absolute top-3 right-3 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow" aria-label="Retake">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A2E" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              </div>
            )}

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

            {cameraError && (
              <div className="bg-amber-light rounded-xl p-3 mb-3">
                <p className="text-caption text-ink-light">{cameraError}</p>
              </div>
            )}

            {!showCamera && (
              <div className="flex gap-3">
                <button onClick={startCamera} className="btn-teal flex-1 gap-2" aria-label={t('takePhoto', lang)}>
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

      {step === 2 && (
        <div className="flex flex-col items-center py-12 animate-fade-up">
          {phase === 'uploading' ? (
            <>
              <div className="w-16 h-16 mb-6 bg-teal-pale rounded-full flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0A6E6E" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
              </div>
              <p className="font-display font-bold text-teal-deep text-heading">{t('uploading', lang)}</p>
              <div className="w-full max-w-xs mt-6">
                <div className="h-2 bg-ivory-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-deep transition-all duration-200 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-ink-muted text-caption mt-2 text-center font-mono">
                  {t('uploadProgress', lang, { percent: uploadProgress })}
                </p>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </div>
  )
}
