import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Home, PlusCircle, FileText, LogOut, Menu, X, Shield, GraduationCap, Globe } from 'lucide-react'
import { useState } from 'react'

export default function CitizenLayout() {
  const { user, logout } = useAuth()
  const { lang, toggleLanguage, t } = useLanguage()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const navItems = [
    { path: '/', label: t('home'), icon: Home },
    { path: '/submit', label: t('reportProblem'), icon: PlusCircle },
    { path: '/my-submissions', label: t('mySubmissions'), icon: FileText },
  ]
  
  const isActive = (path) => location.pathname === path
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        {/* Top official strip */}
        <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>भारत सरकार | Government of India · Smart India Hackathon 2026</span>
            <div className="flex items-center gap-3">
              <span>{t('portalName')}</span>
              <span>·</span>
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                title="Toggle Language / भाषा बदलें"
              >
                <Globe className="w-3 h-3" />
                {lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">SI</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{t('portalName')}</h1>
                <p className="text-[10px] text-gray-500 -mt-0.5">{t('tagline')}</p>
              </div>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path) 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* User & Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switch Button */}
              <button
                onClick={toggleLanguage}
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>

              {/* Role-based quick links */}
              {(user?.role === 'validator' || user?.role === 'admin') && (
                <Link to="/validator" className="hidden md:flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-800 bg-orange-100/70 border border-orange-200 px-2.5 py-1.5 rounded-md">
                  <Shield className="w-3.5 h-3.5" /> {t('validatorPanel')}
                </Link>
              )}
              {(user?.role === 'solver' || user?.role === 'admin') && (
                <Link to="/solver" className="hidden md:flex items-center gap-1 text-xs font-medium text-purple-700 hover:text-purple-800 bg-purple-100/70 border border-purple-200 px-2.5 py-1.5 rounded-md">
                  <GraduationCap className="w-3.5 h-3.5" /> {t('solverPanel')}
                </Link>
              )}
              
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-gray-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-medium text-blue-700 text-sm">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{user?.name}</p>
                  <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              <button onClick={logout} className="hidden md:flex items-center gap-1 text-sm text-gray-400 hover:text-red-600 ml-1 p-1 rounded-md" title={t('logout')}>
                <LogOut className="w-4 h-4" />
              </button>
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold bg-gray-50 text-blue-700 border border-gray-200 mb-2"
              >
                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> भाषा / Language:</span>
                <span>{lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}</span>
              </button>

              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive(item.path) ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              {(user?.role === 'validator' || user?.role === 'admin') && (
                <Link to="/validator" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-orange-700">
                  <Shield className="w-4 h-4" /> {t('validatorPanel')}
                </Link>
              )}
              {(user?.role === 'solver' || user?.role === 'admin') && (
                <Link to="/solver" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-purple-700">
                  <GraduationCap className="w-4 h-4" /> {t('solverPanel')}
                </Link>
              )}

              <div className="border-t border-gray-100 pt-3 mt-2 flex items-center justify-between px-3">
                <span className="text-xs text-gray-700 font-medium">{user?.name} ({user?.role})</span>
                <button onClick={logout} className="text-xs font-semibold text-red-600">{t('logout')}</button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        <Outlet />
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <span>SIH Innovation Hub · Smart India Hackathon 2026 (Problem Statement ID: SIH26043)</span>
            <span className="font-medium text-gray-700">Team SolveGrid · Citizen Crowdsourcing Platform</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
