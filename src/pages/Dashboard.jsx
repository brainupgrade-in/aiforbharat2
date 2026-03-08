import { Link } from 'react-router-dom'
import { UtensilsCrossed, Eye, MessageCircle, TrendingDown, Droplets, Heart } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const glucoseData = [
  { day: 'Mon', fasting: 118, postMeal: 156 },
  { day: 'Tue', fasting: 112, postMeal: 148 },
  { day: 'Wed', fasting: 126, postMeal: 165 },
  { day: 'Thu', fasting: 108, postMeal: 142 },
  { day: 'Fri', fasting: 115, postMeal: 152 },
  { day: 'Sat', fasting: 122, postMeal: 170 },
  { day: 'Sun', fasting: 110, postMeal: 145 },
]

const quickActions = [
  { to: '/glucose', icon: Droplets, label: 'Log Glucose', color: 'bg-blue-50 text-blue-500' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Analyze Meal', color: 'bg-green-50 text-green-500' },
  { to: '/retina', icon: Eye, label: 'Retina Scan', color: 'bg-purple-50 text-purple-500' },
  { to: '/chat', icon: MessageCircle, label: 'AI Advisor', color: 'bg-orange-50 text-orange-500' },
]

export default function Dashboard({ user }) {
  const email = user?.signInDetails?.loginId || 'User'
  const name = email.split('@')[0]
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">{greeting}, {name}</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <Droplets className="w-5 h-5 text-primary-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">126</div>
          <div className="text-[10px] text-gray-500">mg/dL Fasting</div>
          <span className="badge-warning mt-1">Borderline</span>
        </div>
        <div className="card text-center">
          <TrendingDown className="w-5 h-5 text-accent-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">116</div>
          <div className="text-[10px] text-gray-500">7-Day Avg</div>
          <span className="badge-normal mt-1">-8% vs last wk</span>
        </div>
        <div className="card text-center">
          <Heart className="w-5 h-5 text-danger-500 mx-auto mb-1" />
          <div className="text-2xl font-bold text-gray-900">6.8%</div>
          <div className="text-[10px] text-gray-500">Est. HbA1c</div>
          <span className="badge-warning mt-1">Pre-diabetic</span>
        </div>
      </div>

      {/* Glucose Chart */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">7-Day Glucose Trend</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[80, 200]} />
              <Tooltip />
              <ReferenceLine y={100} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Normal', fontSize: 10 }} />
              <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'High', fontSize: 10 }} />
              <Line type="monotone" dataKey="fasting" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} name="Fasting" />
              <Line type="monotone" dataKey="postMeal" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Post-meal" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className="card flex flex-col items-center py-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* AI Insights */}
      <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-100">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-primary-500" />
          AI Insights
        </h2>
        <div className="space-y-3">
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-accent-600">Good pattern:</span> Your glucose is{' '}
              <strong>8% lower</strong> after morning walks. Try walking 20 min before breakfast daily.
            </p>
          </div>
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-sm text-gray-700">
              <span className="font-medium text-warning-600">Watch out:</span> Weekend post-meal spikes detected.
              Consider reducing rice portion to 1/2 cup on Sat-Sun.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-3">Upcoming</h2>
        <div className="space-y-2">
          {[
            { time: '8:00 AM', task: 'Fasting glucose check', done: true },
            { time: '9:30 AM', task: 'Metformin 500mg', done: false },
            { time: '12:00 PM', task: 'Post-lunch glucose', done: false },
            { time: 'Mar 15', task: 'Dr. Sharma appointment', done: false },
          ].map(({ time, task, done }) => (
            <div key={task} className="flex items-center gap-3 py-2">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                done ? 'bg-accent-500 border-accent-500' : 'border-gray-300'
              }`}>
                {done && <span className="text-white text-xs">&#10003;</span>}
              </div>
              <div className="flex-1">
                <span className={`text-sm ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{task}</span>
              </div>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
