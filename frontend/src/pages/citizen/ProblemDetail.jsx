import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { problemsAPI, confirmationsAPI, solversAPI } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import SeverityBadge from '../../components/SeverityBadge'
import PriorityBar from '../../components/PriorityBar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { ArrowLeft, MapPin, Clock, Users, ThumbsUp, Tag, Building2, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ProblemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [confirmations, setConfirmations] = useState([])
  const [adoptions, setAdoptions] = useState([])
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [confirmNote, setConfirmNote] = useState('')
  const [showConfirmForm, setShowConfirmForm] = useState(false)
  const [confirmError, setConfirmError] = useState('')
  const [stakeholderMap, setStakeholderMap] = useState(null)

  useEffect(() => { loadData() }, [id])

  const loadData = async () => {
    setLoading(true)
    try {
      const [probRes, confRes, adoptRes, msRes, mappingRes] = await Promise.all([
        problemsAPI.get(id), confirmationsAPI.list(id), solversAPI.listAdoptions(id),
        solversAPI.listMilestones(id), problemsAPI.getStakeholderMapping()
      ])
      setProblem(probRes.data)
      setConfirmations(confRes.data)
      setAdoptions(adoptRes.data)
      setMilestones(msRes.data)
      const mapping = mappingRes.data.find(m => m.category === probRes.data.ai_category)
      setStakeholderMap(mapping)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleConfirm = async () => {
    setConfirming(true); setConfirmError('')
    try {
      await confirmationsAPI.confirm(id, user.id, { note: confirmNote || null })
      await loadData(); setShowConfirmForm(false); setConfirmNote('')
    } catch (err) { setConfirmError(err.response?.data?.detail || 'Failed to confirm') } finally { setConfirming(false) }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days > 30) return `${Math.floor(days / 30)} months ago`
    if (days > 0) return `${days} days ago`
    const hours = Math.floor(diff / 3600000)
    return hours > 0 ? `${hours} hours ago` : 'Just now'
  }

  if (loading) return <LoadingSpinner message="Loading problem details..." />
  if (!problem) return <div className="text-center py-12 text-gray-500">Problem not found</div>
  const hasUserConfirmed = confirmations.some(c => c.user_id === user?.id)

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-400">{problem.problem_id}</span>
              <StatusBadge status={problem.status} />
              <SeverityBadge severity={problem.severity} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
              {problem.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {problem.location}</span>}
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {timeAgo(problem.created_at)}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {problem.confirmation_count} confirmed</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{problem.description}</p>
            {problem.evidence_urls?.length > 0 && (
              <div className="mt-4 flex gap-2">
                {problem.evidence_urls.map((url, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-xs text-gray-500">Evidence {i+1}</div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-4">Submitted by {problem.submitter_name}</p>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center text-xs">AI</span> AI Analysis
            </h2>
            {problem.ai_category && <div className="mb-3"><span className="text-xs text-gray-500">Category</span><p className="text-sm font-medium text-blue-700">{problem.ai_category}</p></div>}
            {problem.ai_summary && <div className="mb-3"><span className="text-xs text-gray-500">Summary</span><p className="text-sm text-gray-700">{problem.ai_summary}</p></div>}
            {problem.ai_tags?.length > 0 && (
              <div className="mb-3"><span className="text-xs text-gray-500">Tags</span>
                <div className="flex flex-wrap gap-1 mt-1">{problem.ai_tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded"><Tag className="w-3 h-3 inline mr-0.5" />{tag}</span>)}</div>
              </div>
            )}
            {problem.ai_domains?.length > 0 && (
              <div><span className="text-xs text-gray-500">Relevant Expertise</span>
                <div className="flex flex-wrap gap-1 mt-1">{problem.ai_domains.map(d => <span key={d} className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5 rounded"><GraduationCap className="w-3 h-3 inline mr-0.5" />{d}</span>)}</div>
              </div>
            )}
          </div>

          {/* Community Confirmation */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Community Confirmations ({problem.confirmation_count})</h2>
              {!hasUserConfirmed ? (
                <button onClick={() => setShowConfirmForm(!showConfirmForm)} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                  <ThumbsUp className="w-4 h-4" /> I also face this
                </button>
              ) : (
                <span className="flex items-center gap-1 text-green-600 text-sm"><CheckCircle2 className="w-4 h-4" /> You confirmed this</span>
              )}
            </div>
            {showConfirmForm && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 mb-2">Confirm that you also experience this issue</p>
                <textarea value={confirmNote} onChange={(e) => setConfirmNote(e.target.value)} placeholder="Add a note (optional)" className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm mb-2 bg-white" rows={2} />
                {confirmError && <p className="text-xs text-red-600 mb-2"><AlertCircle className="w-3 h-3 inline" /> {confirmError}</p>}
                <button onClick={handleConfirm} disabled={confirming} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm disabled:opacity-50">{confirming ? 'Confirming...' : 'Confirm'}</button>
              </div>
            )}
            <div className="space-y-2">
              {confirmations.slice(0, 10).map(c => (
                <div key={c.id} className="flex items-start gap-2 text-sm">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 mt-0.5">{c.user_name?.charAt(0)}</div>
                  <div><span className="font-medium text-gray-700">{c.user_name}</span>{c.note && <span className="text-gray-500"> - {c.note}</span>}<span className="text-xs text-gray-400 ml-2">{timeAgo(c.created_at)}</span></div>
                </div>
              ))}
              {confirmations.length === 0 && <p className="text-sm text-gray-400">No confirmations yet. Be the first!</p>}
            </div>
          </div>

          {milestones.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Progress Timeline</h2>
              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <div key={m.id} className="flex gap-3">
                    <div className="flex flex-col items-center"><div className="w-3 h-3 rounded-full bg-blue-500"></div>{i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-200"></div>}</div>
                    <div className="pb-4"><p className="text-sm font-medium text-gray-900">{m.title}</p>{m.description && <p className="text-sm text-gray-500">{m.description}</p>}<p className="text-xs text-gray-400 mt-1">{timeAgo(m.created_at)}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Priority Score</h3>
            <PriorityBar breakdown={problem.priority_breakdown} score={problem.priority_score} />
          </div>
          {stakeholderMap && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Potentially Relevant</h3>
              <div className="space-y-3 text-sm">
                {stakeholderMap.govt_body && <div><p className="text-xs text-gray-500">Government Body</p><p className="text-gray-700">{stakeholderMap.govt_body}</p></div>}
                {stakeholderMap.university_expertise?.length > 0 && <div><p className="text-xs text-gray-500">University Expertise</p><div className="flex flex-wrap gap-1 mt-0.5">{stakeholderMap.university_expertise.map(e => <span key={e} className="bg-purple-50 text-purple-600 text-xs px-1.5 py-0.5 rounded">{e}</span>)}</div></div>}
                {stakeholderMap.startup_type && <div><p className="text-xs text-gray-500">Startup Type</p><p className="text-gray-700">{stakeholderMap.startup_type}</p></div>}
                {stakeholderMap.ngo_type && <div><p className="text-xs text-gray-500">NGO Type</p><p className="text-gray-700">{stakeholderMap.ngo_type}</p></div>}
                {stakeholderMap.solution_path && <div><p className="text-xs text-gray-500">Solution Pathway</p><p className="text-gray-700">{stakeholderMap.solution_path}</p></div>}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 italic">These are potentially relevant organizations and expertise areas, not confirmed assignments.</p>
            </div>
          )}
          {adoptions.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3"><Building2 className="w-4 h-4 inline mr-1" />Solver Interest</h3>
              <div className="space-y-2">
                {adoptions.map(a => <div key={a.id} className="bg-gray-50 rounded-lg p-2"><p className="text-sm font-medium text-gray-700">{a.organization_name}</p><p className="text-xs text-gray-500 capitalize">{a.status}</p>{a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}</div>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
