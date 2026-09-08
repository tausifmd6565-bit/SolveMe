import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import { FileText, Users, Building2, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#14b8a6', '#e11d48', '#84cc16']

export default function ValidatorDashboard() {
  const [stats, setStats] = useState(null)
  const [priorityList, setPriorityList] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      dashboardAPI.getStats(), dashboardAPI.getPriorityList(5), dashboardAPI.getRecentActivity(10)
    ]).then(([s, p, a]) => {
      setStats(s.data); setPriorityList(p.data); setRecentActivity(a.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />

  const categoryData = stats ? Object.entries(stats.problems_by_category).map(([name, value]) => ({ name: name.split('/')[0].trim(), value })) : []
  const statusData = stats ? Object.entries(stats.problems_by_status).map(([name, value]) => ({ name, value })) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Government Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of societal challenges and platform activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><FileText className="w-4 h-4" /> Total Problems</div>
          <p className="text-3xl font-bold text-gray-900">{stats?.total_problems || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Users className="w-4 h-4" /> Total Users</div>
          <p className="text-3xl font-bold text-blue-600">{stats?.total_users || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Building2 className="w-4 h-4" /> Organizations</div>
          <p className="text-3xl font-bold text-purple-600">{stats?.total_organizations || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><CheckCircle className="w-4 h-4" /> Confirmations</div>
          <p className="text-3xl font-bold text-green-600">{stats?.total_confirmations || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Problems by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" /><XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
              <Tooltip /><Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Problems by Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie><Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-500" /> Top Priority</h2>
            <Link to="/validator/problems" className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {priorityList.map(p => (
              <Link to={`/validator/problem/${p.id}`} key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-mono text-gray-400">{p.problem_id}</span><StatusBadge status={p.status} /></div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5"><span>{p.location}</span><span>{p.confirmation_count} confirmed</span></div>
                </div>
                <div className="text-right ml-3"><p className="text-lg font-bold text-red-600">{p.priority_score}</p><p className="text-[10px] text-gray-400">priority</p></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 8).map((a, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'problem_submitted' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                <div><p className="text-gray-700 line-clamp-1">{a.title}</p><p className="text-xs text-gray-400">{new Date(a.timestamp).toLocaleDateString()}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
