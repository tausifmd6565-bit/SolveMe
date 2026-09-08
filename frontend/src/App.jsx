import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'

import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Home from './pages/Home'
import Explore from './pages/Explore'
import ReportProblem from './pages/ReportProblem'
import ProblemDetail from './pages/ProblemDetail'
import MyProblems from './pages/MyProblems'
import SolverDashboard from './pages/SolverDashboard'
import ProjectWorkspace from './pages/ProjectWorkspace'
import ImpactPage from './pages/ImpactPage'
import AdminTriage from './pages/AdminTriage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <AppShell>{children}</AppShell>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute><ReportProblem /></ProtectedRoute>} />
      <Route path="/problem/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
      <Route path="/my-problems" element={<ProtectedRoute><MyProblems /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectWorkspace /></ProtectedRoute>} />
      <Route path="/impact" element={<ProtectedRoute><ImpactPage /></ProtectedRoute>} />
      <Route path="/solver" element={<ProtectedRoute><SolverDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminTriage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <AppRoutes />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
