import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Activity, UtensilsCrossed, Eye, MessageCircle, LayoutDashboard } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/glucose', icon: Activity, label: 'Glucose' },
  { to: '/meals', icon: UtensilsCrossed, label: 'Meals' },
  { to: '/retina', icon: Eye, label: 'Retina' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
]

export default function Layout({ signOut, user }) {
  const location = useLocation()
  const initial = user?.signInDetails?.loginId?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary-800">DiabetCare AI</span>
          </div>
          <button
            onClick={signOut}
            className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm hover:bg-primary-200 transition-colors"
            title="Sign out"
          >
            {initial}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-lg mx-auto px-4 py-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[56px] ${
                  isActive ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
