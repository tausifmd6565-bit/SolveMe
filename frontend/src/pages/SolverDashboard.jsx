import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import ExpressInterestModal from './ExpressInterestModal'
import { Briefcase, ArrowUpRight, Check, MapPin, Building2 } from 'lucide-react'

export default function SolverDashboard() {
  const { user } = useAuth()
  const { lang, t, getLocalized, getCategoryName } = useLanguage()

  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await api.getProblems({})
      setProblems(data)
    } finally {
      setLoading(false)
    }
  }

  const recommended = problems.filter(p => !p.solver?.adopted_by && p.status !== 'completed')
  const underReview = problems.filter(p => p.status === 'under_review')
  const adopted = problems.filter(p => p.solver?.adopted_by)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {lang === 'hi' ? 'संस्थान एवं समाधानकर्ता पटल' : 'Technical Partner Portal'}
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('solverHeading')}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>{user?.organization || 'Academic R&D Partner'}</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          {t('solverSubheading')}
        </p>
      </div>

      {/* Recommended Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {t('recommendedSection')} ({recommended.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommended.map(p => {
            const title = getLocalized(p.title)
            const categoryName = getCategoryName(p.category)
            const requiredSkills = p.solver?.relevant_expertise || ['Civil Systems', 'Environmental Feasibility']

            return (
              <div key={p.id} className="panel-card p-5 flex flex-col justify-between space-y-3 bg-white">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-400">{p.id}</span>
                    <ProblemStatus status={p.status} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span><strong>Sector:</strong> {categoryName}</span>
                    <span><strong>Location:</strong> {p.location}</span>
                  </div>

                  {/* Why it may be relevant */}
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Why it may be relevant to your lab:
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      Matches departmental focus on {requiredSkills[0] || 'infrastructure'}. Field site is within regional survey range.
                    </p>
                  </div>

                  {/* Required expertise */}
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Required Expertise:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {requiredSkills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded border border-slate-200 bg-white text-slate-700 text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <Link
                    to={`/problem/${p.id}`}
                    className="flex-1 py-1.5 px-3 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    {t('viewProblemBtn')}
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedProblem(p)
                      setIsModalOpen(true)
                    }}
                    className="flex-1 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold text-center"
                  >
                    {t('expressInterestBtn')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Adopted / In-Progress Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {t('adoptedSection')} ({adopted.length})
        </h3>
        <div className="panel-card overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <th className="p-3">Problem / Project</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Adoption Partner</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Workspace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adopted.map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{p.id} · {getLocalized(p.title)}</td>
                  <td className="p-3 text-slate-600">{getCategoryName(p.category)}</td>
                  <td className="p-3 font-medium text-blue-900">{p.solver?.adopted_by}</td>
                  <td className="p-3"><ProblemStatus status={p.status} /></td>
                  <td className="p-3 text-right">
                    <Link to="/projects" className="text-blue-600 font-semibold hover:underline">
                      View Project →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Express Interest Modal */}
      <ExpressInterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        problem={selectedProblem}
        onSuccess={() => load()}
      />
    </div>
  )
}
