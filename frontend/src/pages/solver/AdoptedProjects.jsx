import { useState, useEffect } from 'react'
import { problemsAPI, solversAPI } from '../../services/api'
import StatusBadge from '../../components/StatusBadge'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import { PlusCircle, Clock, FileText } from 'lucide-react'

export default function AdoptedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [milestoneForm, setMilestoneForm] = useState({ visible: null, title: '', description: '' })
  const [addingMilestone, setAddingMilestone] = useState(false)

  useEffect(() => { loadProjects() }, [])

  const loadProjects = async () => {
    try {
      const probRes = await problemsAPI.list({ page_size: 100 })
      const adopted = probRes.data.problems.filter(p => ['adopted', 'in_progress', 'prototype_pilot', 'completed'].includes(p.status))
      const withMilestones = await Promise.all(adopted.map(async (p) => {
        const msRes = await solversAPI.listMilestones(p.id); return { ...p, milestones: msRes.data }
      }))
      setProjects(withMilestones)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleAddMilestone = async (problemId) => {
    setAddingMilestone(true)
    try {
      await solversAPI.addMilestone(problemId, { title: milestoneForm.title, description: milestoneForm.description })
      setMilestoneForm({ visible: null, title: '', description: '' }); loadProjects()
    } catch (err) { console.error(err) } finally { setAddingMilestone(false) }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    return days > 0 ? `${days} days ago` : `${Math.floor(diff / 3600000)} hours ago`
  }

  if (loading) return <LoadingSpinner message="Loading adopted projects..." />

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold text-gray-900">Adopted Projects</h1><p className="text-sm text-gray-500">Track and update progress on problems your organization is solving</p></div>
      {projects.length === 0 ? <EmptyState title="No adopted projects" message="Express interest in problems to get started" icon={FileText} /> : (
        <div className="space-y-4">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1"><span className="text-xs font-mono text-gray-400">{p.problem_id}</span><StatusBadge status={p.status} /></div>
                  <h3 className="text-base font-semibold text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{p.location} \u00b7 {p.ai_category}</p>
                </div>
                <button onClick={() => setMilestoneForm({ visible: p.id, title: '', description: '' })} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"><PlusCircle className="w-3 h-3" /> Add Update</button>
              </div>
              {milestoneForm.visible === p.id && (
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <input type="text" value={milestoneForm.title} onChange={(e) => setMilestoneForm(f => ({ ...f, title: e.target.value }))} placeholder="Milestone title" className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm mb-2 bg-white" />
                  <textarea value={milestoneForm.description} onChange={(e) => setMilestoneForm(f => ({ ...f, description: e.target.value }))} placeholder="Description..." className="w-full px-3 py-2 border border-purple-200 rounded-lg text-sm mb-2 bg-white" rows={2} />
                  <div className="flex gap-2">
                    <button onClick={() => handleAddMilestone(p.id)} disabled={addingMilestone || !milestoneForm.title} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50">{addingMilestone ? 'Adding...' : 'Save Update'}</button>
                    <button onClick={() => setMilestoneForm({ visible: null, title: '', description: '' })} className="text-gray-500 hover:text-gray-700 text-xs">Cancel</button>
                  </div>
                </div>
              )}
              {p.milestones?.length > 0 ? (
                <div className="space-y-3">
                  {p.milestones.map((m, i) => (
                    <div key={m.id} className="flex gap-3">
                      <div className="flex flex-col items-center"><div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>{i < p.milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-200"></div>}</div>
                      <div className="pb-3"><p className="text-sm font-medium text-gray-900">{m.title}</p>{m.description && <p className="text-xs text-gray-500">{m.description}</p>}<p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(m.created_at)}</p></div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400 italic">No progress updates yet</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
