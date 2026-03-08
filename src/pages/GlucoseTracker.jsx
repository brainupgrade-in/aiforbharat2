import { useState } from 'react'
import { Droplets, Plus, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const initialReadings = [
  { id: 1, value: 126, context: 'Fasting', time: 'Today, 7:30 AM', status: 'high' },
  { id: 2, value: 92, context: 'Before meal', time: 'Yesterday, 12:00 PM', status: 'normal' },
  { id: 3, value: 165, context: 'After meal', time: 'Yesterday, 2:15 PM', status: 'high' },
  { id: 4, value: 108, context: 'Fasting', time: 'Yesterday, 7:00 AM', status: 'normal' },
]

const trendData = [
  { date: '1 Mar', value: 118 },
  { date: '2 Mar', value: 112 },
  { date: '3 Mar', value: 126 },
  { date: '4 Mar', value: 108 },
  { date: '5 Mar', value: 115 },
  { date: '6 Mar', value: 122 },
  { date: '7 Mar', value: 110 },
  { date: '8 Mar', value: 126 },
]

export default function GlucoseTracker() {
  const [showForm, setShowForm] = useState(false)
  const [readings, setReadings] = useState(initialReadings)
  const [glucoseValue, setGlucoseValue] = useState('')
  const [mealContext, setMealContext] = useState('Fasting')
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    if (!glucoseValue) return
    const val = parseInt(glucoseValue)
    const newReading = {
      id: Date.now(),
      value: val,
      context: mealContext,
      time: 'Just now',
      status: val > 140 || (mealContext === 'Fasting' && val > 100) ? 'high' : 'normal',
    }
    setReadings([newReading, ...readings])
    setGlucoseValue('')
    setNotes('')
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Glucose Tracker</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary !px-4 !py-2 gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Log Reading</span>
        </button>
      </div>

      {/* Add Reading Form */}
      {showForm && (
        <div className="card border-primary-200 space-y-3">
          <h2 className="font-semibold text-gray-900">Record Glucose Reading</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Glucose Level (mg/dL)
            </label>
            <input
              type="number"
              value={glucoseValue}
              onChange={(e) => setGlucoseValue(e.target.value)}
              placeholder="e.g., 120"
              className="input-field"
              min="30"
              max="600"
            />
            <p className="text-xs text-gray-400 mt-1">Normal fasting: 70-100 mg/dL</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Context</label>
            <select
              value={mealContext}
              onChange={(e) => setMealContext(e.target.value)}
              className="input-field"
            >
              <option>Fasting</option>
              <option>Before meal</option>
              <option>1-2 hours after meal</option>
              <option>Random</option>
              <option>Before bedtime</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., After morning walk"
              className="input-field !min-h-[72px] resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-primary flex-1 !text-sm">Save Reading</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 !text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Fasting Glucose Trend</h2>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" domain={[80, 160]} />
              <Tooltip />
              <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 3" />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Readings */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Recent Readings</h2>
        <div className="space-y-3">
          {readings.map((reading) => (
            <div key={reading.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  reading.status === 'high' ? 'bg-danger-50' : 'bg-accent-50'
                }`}>
                  <Droplets className={`w-5 h-5 ${
                    reading.status === 'high' ? 'text-danger-500' : 'text-accent-500'
                  }`} />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{reading.value} mg/dL</div>
                  <div className="text-xs text-gray-500">{reading.context} &bull; {reading.time}</div>
                </div>
              </div>
              <span className={reading.status === 'high' ? 'badge-high' : 'badge-normal'}>
                {reading.status === 'high' ? 'High' : 'Normal'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="card bg-primary-50 border-primary-100">
        <h2 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-primary-500" />
          Tips for Accurate Readings
        </h2>
        <ul className="space-y-1.5 text-sm text-gray-600">
          <li>&#8226; Wash hands with warm water before testing</li>
          <li>&#8226; Fast for 8-12 hours for fasting glucose</li>
          <li>&#8226; Test post-meal readings 1-2 hours after first bite</li>
          <li>&#8226; Log consistently at the same times each day</li>
        </ul>
      </div>
    </div>
  )
}
