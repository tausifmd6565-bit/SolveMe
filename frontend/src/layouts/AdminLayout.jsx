import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, FileText, CheckCircle, Building2, LogOut, 
  ChevronLeft, Users, TrendingUp, Shield, GraduationCap, Home
} from 'lucide-react'

export default function AdminLayout({ role = 'validator' }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  
  const validatorNav = [
    { path: '/validator', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/validator/problems', label: 'Problem Queue', icon: FileText },
  ]
  
  const solverNav = [
    { path: '/solver', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/solver/problems', label: 'Available Problems', icon: FileText },
    { path: '/solver/adopted', label: 'Adopted Projects', icon: CheckCircle },
  ]
  
  const navItems = role === 'solver' ? solverNav : validatorNav
  const isActive = (path) => location.pathname === path
  const title = role === 'solver' ? 'University / Solver Panel' : 'Government / Validator Panel'
  const titleIcon = role === 'solver' ? GraduationCap : Shield
  const TitleIcon = titleIcon
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col min-h-screen fixed">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              role === 'solver' ? 'bg-purple-100' : 'bg-orange-100'
            }`}>
              <TitleIcon className={`w-4 h-4 ${role === 'solver' ? 'text-purple-600' : 'text-orange-600'}`} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{title}</h2>
              <p className="text-[10px] text-gray-500">SIH Innovation Hub</p>
            </div>
          </div>
          <Link 
            to="/" 
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Citizen Portal
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? role === 'solver' 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'bg-orange-50 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* User section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              role === 'solver' ? 'bg-purple-100' : 'bg-orange-100'
            }`}>
              <span className={`font-medium text-sm ${role === 'solver' ? 'text-purple-700' : 'text-orange-700'}`}>
                {user?.name?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button onClick={logout} className="text-gray-400 hover:text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
