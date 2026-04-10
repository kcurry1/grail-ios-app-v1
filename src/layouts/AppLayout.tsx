import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Grid2x2, TrendingUp, BarChart2, User } from 'lucide-react'

const tabs = [
  { path: '/home', label: 'Home', Icon: Home },
  { path: '/collection', label: 'Collection', Icon: Grid2x2 },
  { path: '/trends', label: 'Trends', Icon: TrendingUp },
  { path: '/portfolio', label: 'Portfolio', Icon: BarChart2 },
  { path: '/profile', label: 'Profile', Icon: User },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
      <nav
        className="flex items-center"
        style={{
          background: 'var(--bg-card)',
          borderTop: '1px solid var(--border)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {tabs.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-xs"
              style={{ color: active ? 'var(--gold)' : 'var(--text-muted)' }}
            >
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              {label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
