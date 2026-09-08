import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import { 
  Home, Compass, FileText, FolderKanban, BarChart3, 
  Briefcase, ShieldAlert, PlusCircle, Globe, LogOut, 
  Menu, X, Check, UserCircle, Bell
} from 'lucide-react'

export default function AppShell({ children }) {
  const { user, logout, switchRole } = useAuth()
  const { lang, toggleLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/explore', label: t('explore'), icon: Compass },
    { path: '/my-problems', label: t('myProblems'), icon: FileText },
    { path: '/projects', label: t('projects'), icon: FolderKanban },
    { path: '/impact', label: t('impact'), icon: BarChart3 }
  ]

  // Role-specific additions
  if (user?.role === 'solver' || user?.role === 'admin') {
    navItems.push({ path: '/solver', label: t('solverWorkspace'), icon: Briefcase })
  }
  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: t('adminOperations'), icon: ShieldAlert })
  }

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* 1. Persistent Left Sidebar on Desktop */}
      <aside className="w-64 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800 hidden md:flex sticky top-0 h-screen">
        {/* Branding */}
        <div className="p-5 border-b border-slate-800/80">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-sm text-white tracking-wider">
              SM
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight leading-none block">SolveMe</span>
              <span className="text-[11px] text-slate-400 font-medium tracking-normal mt-0.5 block">
                {t('tagline')}
              </span>
            </div>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {lang === 'hi' ? 'मुख्य नेविगेशन' : 'Platform Navigation'}
          </div>
          {navItems.map(item => {
            const active = isActive(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-xs font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Evaluator Role Switcher (Prototype convenience) */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px]">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Switch Demo Role:
          </p>
          <div className="grid grid-cols-3 gap-1">
            {['citizen', 'solver', 'admin'].map(r => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                className={`py-1 rounded text-center font-medium capitalize transition-colors ${
                  user?.role === r ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* User profile & Language toggle */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300 shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-xs">{user?.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800"
            title={t('signOut')}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* 2. Top Bar & Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
                SolveMe
              </h1>
              <span className="text-[11px] text-slate-500 mt-0.5 hidden sm:inline-block">
                Civic Problem-Solving & Institutional Adoption Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bilingual Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Change language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Primary Report CTA */}
            <Link
              to="/report"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('reportProblem')}</span>
              <span className="sm:hidden">{lang === 'hi' ? 'दर्ज करें' : 'Report'}</span>
            </Link>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded text-xs font-medium ${
                  isActive(item.path) ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{user?.name} ({user?.role})</span>
              <button onClick={logout} className="text-red-400">{t('signOut')}</button>
            </div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation (One-hand accessibility) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex items-center justify-around py-2 px-1">
        <Link to="/" className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${isActive('/') ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
          <Home className="w-4 h-4 mb-0.5" />
          <span>{t('home')}</span>
        </Link>
        <Link to="/explore" className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${isActive('/explore') ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
          <Compass className="w-4 h-4 mb-0.5" />
          <span>{t('explore')}</span>
        </Link>
        <Link to="/report" className="flex flex-col items-center py-1 px-3 text-[10px] font-bold text-blue-600">
          <PlusCircle className="w-5 h-5 mb-0.5 text-blue-600" />
          <span>{t('reportProblem')}</span>
        </Link>
        <Link to="/projects" className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${isActive('/projects') ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
          <FolderKanban className="w-4 h-4 mb-0.5" />
          <span>{t('projects')}</span>
        </Link>
        <Link to="/impact" className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${isActive('/impact') ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span>{t('impact')}</span>
        </Link>
      </nav>
    </div>
  )
}
