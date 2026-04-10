import { Routes, Route, Navigate } from 'react-router-dom'
import { useConvexAuth } from 'convex/react'
import { useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import SplashPage from './pages/SplashPage'
import AuthPage from './pages/AuthPage'
import OnboardingPlayers from './pages/onboarding/OnboardingPlayers'
import OnboardingPlan from './pages/onboarding/OnboardingPlan'
import OnboardingFirstCard from './pages/onboarding/OnboardingFirstCard'
import HomePage from './pages/HomePage'
import AppLayout from './layouts/AppLayout'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) return <Loader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  if (isLoading) return <Loader />
  if (isAuthenticated) return <Navigate to="/home" replace />
  return <>{children}</>
}

function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const me = useQuery(api.users.getMe)
  if (isLoading || me === undefined) return <Loader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (me?.onboardingComplete) return <Navigate to="/home" replace />
  return <>{children}</>
}

function AppGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const me = useQuery(api.users.getMe)
  if (isLoading || me === undefined) return <Loader />
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  if (!me?.onboardingComplete) return <Navigate to="/onboarding/players" replace />
  return <>{children}</>
}

function Loader() {
  return <div style={{ background: 'var(--bg)', height: '100%' }} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnlyRoute><SplashPage /></PublicOnlyRoute>} />
      <Route path="/auth" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />

      {/* Onboarding flow */}
      <Route path="/onboarding/players" element={<OnboardingGuard><OnboardingPlayers /></OnboardingGuard>} />
      <Route path="/onboarding/plan" element={<AuthGuard><OnboardingPlan /></AuthGuard>} />
      <Route path="/onboarding/first-card" element={<AuthGuard><OnboardingFirstCard /></AuthGuard>} />

      {/* Main app */}
      <Route element={<AppGuard><AppLayout /></AppGuard>}>
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
