import { Link } from 'react-router-dom'
import { Activity, UtensilsCrossed, Eye, MessageCircle, Wifi, Languages } from 'lucide-react'

const features = [
  { icon: Activity, title: 'Glucose Tracking', desc: 'Log readings, track trends, get AI-powered insights', color: 'bg-blue-50 text-blue-500' },
  { icon: UtensilsCrossed, title: 'Meal Analysis', desc: 'Photo-based Indian food recognition & carb estimation', color: 'bg-green-50 text-green-500' },
  { icon: Eye, title: 'Retina Screening', desc: 'AI diabetic retinopathy detection from your phone', color: 'bg-purple-50 text-purple-500' },
  { icon: MessageCircle, title: 'AI Advisor', desc: '24/7 personalized diabetes guidance in Hindi & English', color: 'bg-orange-50 text-orange-500' },
  { icon: Wifi, title: 'Offline Support', desc: 'Core features work without internet on 2G/3G', color: 'bg-teal-50 text-teal-500' },
  { icon: Languages, title: 'Multilingual', desc: 'English, Hindi, Tamil, Telugu & Bengali support', color: 'bg-pink-50 text-pink-500' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 via-primary-600 to-primary-800">
      {/* Hero */}
      <div className="px-6 pt-16 pb-12 text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
            <Activity className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">DiabetCare AI</h1>
        <p className="text-primary-100 text-lg leading-relaxed max-w-md mx-auto">
          Your AI-powered companion for diabetes management and early retinopathy detection
        </p>
        <div className="mt-4 text-primary-200 text-sm">
          Serving 225 million Indians with diabetes & pre-diabetes
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-8 text-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 min-h-[56px]"
        >
          Get Started Free
        </Link>
        <p className="text-primary-200 text-sm mt-3">No account required to explore</p>
      </div>

      {/* Features */}
      <div className="bg-gray-50 rounded-t-3xl px-6 pt-10 pb-16">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-8">What DiabetCare AI Does</h2>
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card flex flex-col items-center text-center p-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-3 max-w-lg mx-auto">
          {[
            { value: '89.8M', label: 'Diabetics in India' },
            { value: '43%', label: 'Undiagnosed' },
            { value: '92%+', label: 'AI Accuracy' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-3">
              <div className="text-2xl font-bold text-primary-600">{value}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Powered by */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400 mb-2">Powered by</p>
          <p className="text-sm font-medium text-gray-600">
            ollama_cloud &bull; Hasura &bull; CloudNativePG &bull; k3s
          </p>
        </div>
      </div>
    </div>
  )
}
