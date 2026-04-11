import { Routes, Route, Navigate } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import SplashPage from './pages/SplashPage'
import AuthPage from './pages/AuthPage'
import OnboardingPlayers from './pages/onboarding/OnboardingPlayers'
import OnboardingPlan from './pages/onboarding/OnboardingPlan'
import OnboardingFirstCard from './pages/onboarding/OnboardingFirstCard'
import HomePage from './pages/HomePage'
import AppLayout from './layouts/AppLayout'

function Loader() {
  return <div style={{ background: 'var(--bg)', height: '100%' }} />
}

// Only blocks unauthenticated users — does NOT redirect authenticated ones away
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) return <Loader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

// Only blocks authenticated users from seeing splash/auth
function RequireGuest({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) return <Loader />
  if (isAuthenticated) return <Navigate to="/onboarding/players" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<RequireGuest><SplashPage /></RequireGuest>} />
      <Route path="/auth" element={<RequireGuest><AuthPage /></RequireGuest>} />

      {/* Onboarding — just needs auth */}
      <Route path="/onboarding/players" element={<RequireAuth><OnboardingPlayers /></RequireAuth>} />
      <Route path="/onboarding/plan" element={<RequireAuth><OnboardingPlan /></RequireAuth>} />
      <Route path="/onboarding/first-card" element={<RequireAuth><OnboardingFirstCard /></RequireAuth>} />

      {/* Main app */}
      <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/collection" element={<div className="p-5" style={{ color: 'var(--text-muted)' }}>Collection coming soon</div>} />
        <Route path="/trends" element={<div className="p-5" style={{ color: 'var(--text-muted)' }}>Trends coming soon</div>} />
        <Route path="/portfolio" element={<div className="p-5" style={{ color: 'var(--text-muted)' }}>Portfolio coming soon</div>} />
        <Route path="/profile" element={<div className="p-5" style={{ color: 'var(--text-muted)' }}>Profile coming soon</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
