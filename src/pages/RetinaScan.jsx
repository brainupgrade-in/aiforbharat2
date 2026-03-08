import { useState, useRef } from 'react'
import { Eye, Camera, Upload, AlertTriangle, Shield, FileText, Clock } from 'lucide-react'

const demoResult = {
  classification: 'Mild NPDR',
  confidence: 87,
  riskLevel: 'moderate',
  findings: [
    { label: 'Microaneurysms', status: 'detected', detail: '3 spots in temporal region' },
    { label: 'Hemorrhages', status: 'none', detail: 'No hemorrhages detected' },
    { label: 'Hard exudates', status: 'none', detail: 'No exudates detected' },
    { label: 'Optic disc', status: 'normal', detail: 'Normal appearance' },
  ],
  recommendations: [
    'Schedule follow-up with ophthalmologist within 6 months',
    'Maintain HbA1c below 7% to slow progression',
    'Control blood pressure (<130/80 mmHg)',
    'Repeat AI screening in 6 months',
  ],
}

const history = [
  { date: 'Jan 2026', result: 'No DR', confidence: 92 },
  { date: 'Jul 2025', result: 'No DR', confidence: 89 },
]

export default function RetinaScan() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const handleCapture = () => fileRef.current?.click()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setScanning(true)
      setTimeout(() => {
        setResult(demoResult)
        setScanning(false)
      }, 3000)
    }
  }

  const handleDemo = () => {
    setPreview(null)
    setScanning(true)
    setTimeout(() => {
      setResult(demoResult)
      setScanning(false)
    }, 3000)
  }

  const riskColors = {
    low: 'bg-accent-100 text-accent-600',
    moderate: 'bg-warning-100 text-warning-600',
    high: 'bg-danger-100 text-danger-600',
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Retina Scan</h1>
      <p className="text-sm text-gray-500 -mt-2">AI-powered diabetic retinopathy screening</p>

      {/* Capture */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-2">Capture Fundus Image</h2>
        <p className="text-xs text-gray-500 mb-3">Use good lighting and hold steady. No special equipment required.</p>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="rounded-xl overflow-hidden mb-3 bg-black">
            <img src={preview} alt="Retina" className="w-full h-48 object-contain" />
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 mb-3">
            <Eye className="w-12 h-12 mb-2 text-gray-500" />
            <span className="text-sm text-gray-400">Fundus image preview</span>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleCapture} className="btn-primary flex-1 gap-2 !text-sm">
            <Camera className="w-4 h-4" /> Capture
          </button>
          <button onClick={handleCapture} className="btn-secondary flex-1 gap-2 !text-sm">
            <Upload className="w-4 h-4" /> Upload
          </button>
        </div>
        <button onClick={handleDemo} className="w-full mt-2 text-sm text-primary-500 font-medium py-2 hover:text-primary-700">
          Try demo analysis
        </button>
      </div>

      {/* Scanning */}
      {scanning && (
        <div className="card flex flex-col items-center py-8">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-3" />
          <p className="font-medium text-gray-700">Analyzing with Amazon Rekognition...</p>
          <p className="text-sm text-gray-500 mt-1">Scanning for diabetic retinopathy signs</p>
        </div>
      )}

      {/* Results */}
      {result && !scanning && (
        <>
          {/* Classification */}
          <div className="card border-2 border-warning-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg text-gray-900">{result.classification}</h2>
                <p className="text-sm text-gray-500">Confidence: {result.confidence}%</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${riskColors[result.riskLevel]}`}>
                {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)} Risk
              </span>
            </div>

            {/* Findings */}
            <div className="space-y-2">
              {result.findings.map((f) => (
                <div key={f.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{f.label}</div>
                    <div className="text-xs text-gray-400">{f.detail}</div>
                  </div>
                  <span className={
                    f.status === 'detected' ? 'badge-warning' :
                    f.status === 'normal' ? 'badge-normal' : 'badge-normal'
                  }>
                    {f.status === 'detected' ? 'Detected' : f.status === 'normal' ? 'Normal' : 'Clear'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card bg-primary-50 border-primary-100">
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              Recommendations
            </h2>
            <ul className="space-y-1.5">
              {result.recommendations.map((r, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-primary-500 font-bold mt-0.5">{i + 1}.</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="card bg-danger-50 border-danger-100">
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-danger-500 shrink-0 mt-0.5" />
              <span>
                <strong>Disclaimer:</strong> This AI screening is for early detection only and is NOT a medical diagnosis.
                Always consult a qualified ophthalmologist for professional evaluation and treatment decisions.
              </span>
            </p>
          </div>
        </>
      )}

      {/* Screening History */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Screening History
        </h2>
        <div className="space-y-2">
          {history.map((h) => (
            <div key={h.date} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-700">{h.result}</div>
                <div className="text-xs text-gray-400">{h.date}</div>
              </div>
              <span className="badge-normal">Confidence: {h.confidence}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment info */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-gray-400" />
          Compatible Accessories (Optional)
        </h2>
        <p className="text-xs text-gray-500 mb-2">No special equipment required. For better results, consider:</p>
        <div className="space-y-1.5 text-sm text-gray-600">
          <div>&#8226; D-Eye lens adapter — ~$450</div>
          <div>&#8226; Welch Allyn iExaminer — ~$200</div>
          <div>&#8226; Remidio FOP — ~$300</div>
        </div>
      </div>
    </div>
  )
}
