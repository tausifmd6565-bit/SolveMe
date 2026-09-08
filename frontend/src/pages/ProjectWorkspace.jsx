import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import ProjectTimeline from '../components/common/ProjectTimeline'
import { FolderKanban, Plus, Users, Award, FileCheck2, CheckCircle2 } from 'lucide-react'

export default function ProjectWorkspace() {
  const { lang, t, getLocalized } = useLanguage()
  const [projects, setProjects] = useState([])
  const [activeProject, setActiveProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [newMilestoneNote, setNewMilestoneNote] = useState('')
  const [newMilestoneStatus, setNewMilestoneStatus] = useState('in_progress')

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getProblems({})
      const adoptedList = data.filter(p => p.solver?.adopted_by)
      setProjects(adoptedList)
      if (adoptedList.length > 0) {
        setActiveProject(adoptedList[0])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddMilestone = async (e) => {
    e.preventDefault()
    if (!newMilestoneNote.trim()) return
    try {
      const updated = await api.addMilestone(activeProject.id, {
        status: newMilestoneStatus,
        note: newMilestoneNote
      })
      setActiveProject(updated)
      setShowMilestoneModal(false)
      setNewMilestoneNote('')
      load()
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading project workspaces...</div>
  }

  if (!activeProject) {
    return (
      <div className="panel-card p-12 text-center space-y-2">
        <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">No active adopted projects yet</h3>
        <p className="text-xs text-slate-500">Problems that get adopted by universities appear here as active engineering projects.</p>
      </div>
    )
  }

  const title = getLocalized(activeProject.title)

  return (
    <div className="space-y-6">
      {/* Project Selector tabs */}
      {projects.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                activeProject.id === p.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p.id}: {getLocalized(p.title).slice(0, 30)}...
            </button>
          ))}
        </div>
      )}

      {/* Project Header */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Solver Project Workspace · {activeProject.id}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ProblemStatus status={activeProject.status} />
            <button
              onClick={() => setShowMilestoneModal(true)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('postMilestoneBtn')}</span>
            </button>
          </div>
        </div>

        {/* Solver partner badge */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Lead Partner: <strong>{activeProject.solver?.adopted_by}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Location: {activeProject.location}</span>
          </span>
        </div>
      </div>

      {/* Horizontal Lifecycle */}
      <ProjectTimeline currentStatus={activeProject.status} timeline={activeProject.timeline} />

      {/* Technical Approach & Impact Target Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Technical Approach */}
        <div className="panel-card p-5 space-y-2 bg-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {lang === 'hi' ? 'प्रस्तावित तकनीकी दृष्टिकोण' : 'Proposed Technical Methodology'}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {activeProject.solver?.proposal || 'Undergoing detailed site survey and structural modeling with university student team.'}
          </p>
        </div>

        {/* Expected / Measured Impact */}
        <div className="panel-card p-5 space-y-2 bg-white">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {lang === 'hi' ? 'मापा गया परिणाम / प्रभाव' : 'Field Impact & Deliverables'}
          </h4>
          <div className="space-y-1.5 text-xs">
            <p><strong className="text-slate-600">Population Benefited:</strong> {activeProject.impact?.people_affected}</p>
            <p><strong className="text-slate-600">Coverage Corridor:</strong> {activeProject.impact?.area_covered}</p>
            <p><strong className="text-slate-600">Verified Outcome:</strong> {activeProject.impact?.measured_outcome}</p>
          </div>
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl panel-border shadow-xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Post Milestone Update
            </h3>
            <form onSubmit={handleAddMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Transition</label>
                <select
                  value={newMilestoneStatus}
                  onChange={e => setNewMilestoneStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs bg-white outline-none focus:border-slate-900"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="prototype_pilot">Prototype / Pilot Built</option>
                  <option value="completed">Completed & Verified</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Description</label>
                <textarea
                  value={newMilestoneNote}
                  onChange={e => setNewMilestoneNote(e.target.value)}
                  rows={3}
                  placeholder="Detail field tests, student team progress, or prototype construction..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 leading-relaxed"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-3 py-1.5 border border-slate-200 text-xs font-semibold text-slate-600 rounded hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800"
                >
                  Post Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
