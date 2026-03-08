import { useState, useRef } from 'react'
import { Camera, Upload, Utensils, Leaf, AlertTriangle, Clock } from 'lucide-react'

const demoResult = {
  name: 'North Indian Thali',
  items: [
    { name: 'Rice (steamed)', portion: '1 cup', carbs: 45, gi: 'High' },
    { name: 'Roti (whole wheat)', portion: '2 pieces', carbs: 30, gi: 'Medium' },
    { name: 'Dal tadka', portion: '1 bowl', carbs: 18, gi: 'Low' },
    { name: 'Mixed vegetables', portion: '1 bowl', carbs: 8, gi: 'Low' },
    { name: 'Paneer curry', portion: '1/2 bowl', carbs: 4, gi: 'Low' },
  ],
  totalCarbs: 105,
  glycemicLoad: 'High',
  healthScore: 6,
  suggestions: [
    'Reduce rice to 1/2 cup (-22g carbs)',
    'Choose brown rice for lower glycemic index',
    'Add a side salad with lemon dressing',
    'Eat dal and vegetables first, rice last',
  ],
  estimatedSpike: '160-180 mg/dL in 1-2 hours',
}

const recentMeals = [
  { name: 'Poha with peanuts', carbs: 35, gi: 'Medium', time: 'Today, 8:30 AM' },
  { name: 'Chole bhature', carbs: 85, gi: 'High', time: 'Yesterday, 1:00 PM' },
  { name: 'Dosa with sambar', carbs: 52, gi: 'Medium', time: 'Yesterday, 8:00 AM' },
]

export default function MealAnalyzer() {
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const handleCapture = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      setAnalyzing(true)
      // Simulate AI analysis
      setTimeout(() => {
        setResult(demoResult)
        setAnalyzing(false)
      }, 2000)
    }
  }

  const handleDemo = () => {
    setPreview(null)
    setAnalyzing(true)
    setTimeout(() => {
      setResult(demoResult)
      setAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-900">Meal Analyzer</h1>

      {/* Camera / Upload */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Analyze Your Meal</h2>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {preview ? (
          <div className="rounded-xl overflow-hidden mb-3">
            <img src={preview} alt="Meal" className="w-full h-48 object-cover" />
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 mb-3">
            <Camera className="w-10 h-10 mb-2" />
            <span className="text-sm">Take a photo of your meal</span>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleCapture} className="btn-primary flex-1 gap-2 !text-sm">
            <Camera className="w-4 h-4" /> Take Photo
          </button>
          <button onClick={handleCapture} className="btn-secondary flex-1 gap-2 !text-sm">
            <Upload className="w-4 h-4" /> Gallery
          </button>
        </div>
        <button onClick={handleDemo} className="w-full mt-2 text-sm text-primary-500 font-medium py-2 hover:text-primary-700">
          Try demo analysis (North Indian Thali)
        </button>
      </div>

      {/* Analyzing */}
      {analyzing && (
        <div className="card flex flex-col items-center py-8">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-3" />
          <p className="font-medium text-gray-700">Analyzing with Amazon Nova Pro...</p>
          <p className="text-sm text-gray-500 mt-1">Identifying Indian dishes & estimating carbs</p>
        </div>
      )}

      {/* Results */}
      {result && !analyzing && (
        <>
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary-500" />
                {result.name}
              </h2>
              <span className={result.glycemicLoad === 'High' ? 'badge-high' : 'badge-warning'}>
                GI: {result.glycemicLoad}
              </span>
            </div>

            {/* Food items */}
            <div className="space-y-2 mb-4">
              {result.items.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.portion}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.carbs}g</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{result.totalCarbs}g</div>
                <div className="text-[10px] text-gray-500">Total Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-warning-600">{result.healthScore}/10</div>
                <div className="text-[10px] text-gray-500">Health Score</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-danger-500">{result.glycemicLoad}</div>
                <div className="text-[10px] text-gray-500">Glycemic Load</div>
              </div>
            </div>
          </div>

          {/* Estimated spike */}
          <div className="card bg-warning-50 border-warning-100">
            <p className="text-sm text-gray-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-warning-500 mt-0.5 shrink-0" />
              <span>
                <strong>Estimated glucose spike:</strong> {result.estimatedSpike}
              </span>
            </p>
          </div>

          {/* Suggestions */}
          <div className="card bg-accent-50 border-accent-100">
            <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-accent-500" />
              AI Recommendations
            </h2>
            <ul className="space-y-1.5">
              {result.suggestions.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-accent-500 mt-0.5">&#10003;</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Recent Meals */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Recent Meals
        </h2>
        <div className="space-y-3">
          {recentMeals.map((meal) => (
            <div key={meal.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <div className="text-sm font-medium text-gray-700">{meal.name}</div>
                <div className="text-xs text-gray-400">{meal.time}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{meal.carbs}g carbs</div>
                <span className={meal.gi === 'High' ? 'badge-high' : 'badge-warning'}>{meal.gi} GI</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
