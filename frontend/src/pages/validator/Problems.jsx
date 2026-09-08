import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { problemsAPI } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import SeverityBadge from '../../components/SeverityBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Search, Eye } from 'lucide-react'

export default function ValidatorProblems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => { loadData() }, [statusFilter, categoryFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = { page_size: 100, sort_by: 'priority' }
      if (statusFilter) params.status = statusFilter
      if (categoryFilter) params.category = categoryFilter
      if (search) params.search = search
      const [probRes, catRes] = await Promise.all([problemsAPI.list(params), problemsAPI.getCategories()])
      setProblems(probRes.data.problems); setCategories(catRes.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleStatusChange = async (problemId, newStatus) => {
    try { await problemsAPI.update(problemId, { status: newStatus }); loadData() } catch (err) { console.error(err) }
  }

  if (loading) return <LoadingSpinner message="Loading problems..." />

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Problem Queue</h1><p className="text-sm text-gray-500">Review, validate, and manage reported problems</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <form onSubmit={(e) => { e.preventDefault(); loadData() }} className="flex-1 min-w-[200px]">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </form>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Status</option><option value="published">Published</option><option value="community_validated">Community Validated</option><option value="under_review">Under Review</option><option value="adopted">Adopted</option><option value="in_progress">In Progress</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Categories</option>{categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
          </select>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Problem</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Confirmed</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-200">
              {problems.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{p.problem_id}</td>
                  <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900 line-clamp-1 max-w-[250px]">{p.title}</p><p className="text-xs text-gray-500">{p.location}</p></td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate">{p.ai_category}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3"><SeverityBadge severity={p.severity} /></td>
                  <td className="px-4 py-3"><span className={`text-sm font-bold ${p.priority_score >= 10 ? 'text-red-600' : p.priority_score >= 6 ? 'text-yellow-600' : 'text-gray-600'}`}>{p.priority_score}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.confirmation_count}</td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2">
                    <Link to={`/validator/problem/${p.id}`} className="text-blue-600 hover:text-blue-700"><Eye className="w-4 h-4" /></Link>
                    <select value={p.status} onChange={(e) => handleStatusChange(p.id, e.target.value)} className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white">
                      <option value="published">Published</option><option value="community_validated">Validated</option><option value="under_review">Under Review</option><option value="adopted">Adopted</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="archived">Archived</option>
                    </select>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
