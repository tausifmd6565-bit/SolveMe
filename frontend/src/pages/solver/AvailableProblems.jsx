import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { problemsAPI, solversAPI } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import SeverityBadge from '../../components/SeverityBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import { Search, MapPin, Users, GraduationCap, Handshake, CheckCircle } from 'lucide-react'

export default function SolverAvailableProblems() {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [adopting, setAdopting] = useState(null)
  const [adoptSuccess, setAdoptSuccess] = useState(null)

  useEffect(() => { loadData() }, [category])

  const loadData = async () => {
    setLoading(true)
    try {
      const params = { page_size: 50, sort_by: 'priority' }
      if (category) params.category = category
      if (search) params.search = search
      const [probRes, catRes] = await Promise.all([problemsAPI.list(params), problemsAPI.getCategories()])
      setProblems(probRes.data.problems.filter(p => ['published', 'community_validated', 'under_review'].includes(p.status)))
      setCategories(catRes.data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleAdopt = async (problemId) => {
    setAdopting(problemId)
    try {
      await solversAPI.adopt(problemId, user.id, { notes: 'Interested in solving this problem' })
      setAdoptSuccess(problemId); setTimeout(() => setAdoptSuccess(null), 3000)
    } catch (err) { alert(err.response?.data?.detail || 'Failed to express interest') } finally { setAdopting(null) }
  }

  if (loading) return <LoadingSpinner message="Loading available problems..." />

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Available Problems</h1><p className="text-sm text-gray-500">Find and adopt societal challenges to solve</p></div>
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex gap-3">
          <form onSubmit={(e) => { e.preventDefault(); loadData() }} className="flex-1">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search problems..." className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm" /></div>
          </form>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option value="">All Categories</option>{categories.map(c => <option key={c.category} value={c.category}>{c.category}</option>)}
          </select>
        </div>
      </div>
      {problems.length === 0 ? <EmptyState title="No problems available" message="Check back later" /> : (
        <div className="grid gap-4">
          {problems.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs font-mono text-gray-400">{p.problem_id}</span><StatusBadge status={p.status} /><SeverityBadge severity={p.severity} /></div>
                  <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.ai_summary || p.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                    {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>}
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.confirmation_count} confirmed</span>
                    {p.ai_category && <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{p.ai_category}</span>}
                  </div>
                  {p.ai_domains?.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{p.ai_domains.map(d => <span key={d} className="flex items-center gap-0.5 bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded"><GraduationCap className="w-3 h-3" /> {d}</span>)}</div>}
                </div>
                <div className="ml-4 text-right space-y-2">
                  <div><p className={`text-lg font-bold ${p.priority_score >= 10 ? 'text-red-600' : 'text-yellow-600'}`}>{p.priority_score}</p><p className="text-[10px] text-gray-400">priority</p></div>
                  {adoptSuccess === p.id ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3" /> Interest sent!</span> : (
                    <button onClick={() => handleAdopt(p.id)} disabled={adopting === p.id || !user?.organization_id}
                      className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50"
                      title={!user?.organization_id ? 'You must belong to an organization' : ''}>
                      <Handshake className="w-3 h-3" /> {adopting === p.id ? 'Sending...' : 'Express Interest'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
