import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import PriorityBreakdown from '../components/common/PriorityBreakdown'
import EvidenceViewer from '../components/common/EvidenceViewer'
import AIInsight from '../components/common/AIInsight'
import SolverPathway from '../components/common/SolverPathway'
import ProjectTimeline from '../components/common/ProjectTimeline'
import ExpressInterestModal from './ExpressInterestModal'
import { 
  ArrowLeft, Users, MapPin, Calendar, Check, 
  Hand, Briefcase, Share2, AlertCircle 
} from 'lucide-react'

export default function ProblemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const { lang, t, getLocalized, getCategoryName } = useLanguage()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    loadProblem()
  }, [id])

  const loadProblem = async () => {
    setLoading(true)
    try {
      const data = await api.getProblemById(id)
      setProblem(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleEndorse = async () => {
    if (problem.userConfirmed) return
    setConfirming(true)
    try {
      const updated = await api.confirmProblem(problem.id)
      setProblem(updated)
      setFeedback(lang === 'hi' ? 'आपका समर्थन दर्ज कर लिया गया है।' : 'Your endorsement has been registered.')
      setTimeout(() => setFeedback(''), 3500)
    } catch (e) {
      console.error(e)
    } finally {
      setConfirming(false)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        {lang === 'hi' ? 'समस्या का विवरण लोड हो रहा है...' : 'Loading problem assessment record...'}
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="panel-card p-12 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">
          {lang === 'hi' ? 'समस्या नहीं मिली' : 'Problem Record Not Found'}
        </h3>
        <Link to="/" className="text-xs text-blue-600 font-semibold hover:underline">
          ← {lang === 'hi' ? 'होम पर वापस जाएं' : 'Return to Community Feed'}
        </Link>
      </div>
    )
  }

  const title = getLocalized(problem.title)
  const description = getLocalized(problem.description)
  const categoryName = getCategoryName(problem.category)

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'hi' ? 'सामुदायिक समस्याओं पर वापस जाएं' : 'Back to Community Problems'}</span>
      </Link>

      {/* 1. Header with Metadata */}
      <div className="space-y-3 pb-6 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-slate-500">
            {problem.id}
          </span>
          <span className="px-2.5 py-0.5 rounded border border-slate-200 bg-slate-100 text-slate-700 text-xs font-medium">
            {categoryName}
          </span>
          <ProblemStatus status={problem.status} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{problem.location}</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <strong className="text-slate-800">{problem.confirmations}</strong> {t('confirmationsCount')}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Logged: {problem.timeline?.[0]?.date || '2026'}</span>
          </span>
        </div>
      </div>

      {/* 2. Primary Endorsement & Solver Action Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {lang === 'hi' ? 'सामुदायिक समर्थन (नागरिक पुष्टि)' : 'Community Validation Signal'}
            </h3>
            {problem.userConfirmed && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ✓ {t('alreadyEndorsed')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('endorseHelp')}
          </p>
          {feedback && <p className="text-xs text-emerald-600 font-semibold mt-1">{feedback}</p>}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* "I Also Face This Issue" Primary Button */}
          <button
            onClick={handleEndorse}
            disabled={confirming || problem.userConfirmed}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              problem.userConfirmed
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>{problem.userConfirmed ? t('alreadyEndorsed') : t('alsoFaceIssue')}</span>
          </button>

          {/* If Solver User, Show Adoption Proposal Button */}
          {(user?.role === 'solver' || user?.role === 'admin') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 rounded text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('expressInterestBtn')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Evidence Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {t('evidenceSection')}
        </h3>
        <EvidenceViewer evidence={problem.evidence} />
      </div>

      {/* 4. Problem Description */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {t('descriptionSection')}
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-normal">
          {description}
        </p>
      </div>

      {/* 5. AI-Assisted Intake Understanding */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <AIInsight ai={problem.ai} category={problem.category} />
      </div>

      {/* 6. Transparent Rule-Based Priority Breakdown */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <PriorityBreakdown priority={problem.priority} />
      </div>

      {/* 7. Potentially Relevant Expertise & Potential Pathways */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <SolverPathway solver={problem.solver} />
      </div>

      {/* 8. Project Status & Lifecycle Timeline */}
      <div className="space-y-2 pt-2 border-t border-slate-200">
        <ProjectTimeline currentStatus={problem.status} timeline={problem.timeline} />
      </div>

      {/* Express Interest Modal */}
      <ExpressInterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        problem={problem}
        onSuccess={() => loadProblem()}
      />
    </div>
  )
}
