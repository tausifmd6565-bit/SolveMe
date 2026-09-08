import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI, problemsAPI } from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import StatusBadge from '../../components/StatusBadge'
import { FileText, CheckCircle, TrendingUp, Building2, ArrowRight } from 'lucide-react'

export default function SolverDashboard() {
  const [stats, setStats] = useState(null)
  const [matchingProblems, setMatchingProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), problemsAPI.list({ page_size: 50, sort_by: 'priority' })])
      .then(([s, p]) => {
        setStats(s.data)
        setMatchingProblems(p.data.problems.filter(pr => ['published', 'community_validated', 'under_review'].includes(pr.status)).slice(0, 6))
      }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner message="Loading solver dashboard..." />

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Solver Dashboard</h1><p className="text-sm text-gray-500">Find societal challenges matching your expertise</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><FileText className="w-4 h-4" /> Available</div><p className="text-3xl font-bold text-gray-900">{stats?.total_problems || 0}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><TrendingUp className="w-4 h-4" /> High Priority</div><p className="text-3xl font-bold text-red-600">{matchingProblems.filter(p => p.priority_score >= 10).length}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><CheckCircle className="w-4 h-4" /> Adopted</div><p className="text-3xl font-bold text-green-600">{stats?.total_adoptions || 0}</p></div>
        <div className="bg-white rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2 text-gray-500 text-sm mb-2"><Building2 className="w-4 h-4" /> Organizations</div><p className="text-3xl font-bold text-purple-600">{stats?.total_organizations || 0}</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Problems Ready for Solvers</h2>
          <Link to="/solver/problems" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">Browse all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {matchingProblems.map(p => (
            <Link to="/solver/problems" key={p.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
              <div className="flex items-center gap-2 mb-1"><span className="text-xs font-mono text-gray-400">{p.problem_id}</span><StatusBadge status={p.status} /></div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{p.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{p.ai_summary}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{p.ai_category?.split('/')[0]}</span>
                <span>Priority: {p.priority_score}</span><span>{p.confirmation_count} confirmed</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
