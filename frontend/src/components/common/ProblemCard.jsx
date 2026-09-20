import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { api } from '../../services/api'
import ProblemStatus from './ProblemStatus'
import { ArrowUp, Check, Lightbulb, MapPin, ArrowRight, ShieldCheck } from 'lucide-react'

export default function ProblemCard({ problem, onUpdate }) {
  const { lang, t, getLocalized, getCategoryName } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [isSupported, setIsSupported] = useState(problem.userConfirmed || false)
  const [supportCount, setSupportCount] = useState(problem.confirmations || 0)
  const [loadingSupport, setLoadingSupport] = useState(false)

  const title = getLocalized(problem.title)
  const description = getLocalized(problem.description)
  const categoryName = getCategoryName(problem.category)
  const priorityTotal = problem.priority?.total || 12

  const handleSupportClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSupported || loadingSupport) return

    setLoadingSupport(true)
    setIsSupported(true)
    setSupportCount(prev => prev + 1)

    try {
      const updated = await api.confirmProblem(problem.id, user)
      if (onUpdate && updated) {
        onUpdate(updated)
      }
    } catch (err) {
      console.warn('Confirmation error:', err)
    } finally {
      setLoadingSupport(false)
    }
  }

  const handleSuggestionClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/problem/${problem.id}#suggestions-section`)
  }

  return (
    <div className="panel-card p-4 sm:p-5 bg-white transition-all hover:border-slate-400 group space-y-3">
      {/* Top Meta Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-slate-500">
            {problem.id}
          </span>
          <span className="text-slate-300">•</span>
          <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-semibold">
            {categoryName}
          </span>
        </div>
        <ProblemStatus status={problem.status} />
      </div>

      {/* Title & Preview Link */}
      <div className="space-y-1">
        <Link 
          to={`/problem/${problem.id}`} 
          className="text-sm sm:text-base font-bold text-slate-950 hover:text-blue-600 transition-colors leading-snug block"
        >
          {title}
        </Link>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
          {problem.ai ? getLocalized(problem.ai.summary) : description}
        </p>
      </div>

      {/* Location & Score Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
        <span className="flex items-center gap-1.5 font-medium text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate max-w-[240px] sm:max-w-xs">{problem.location}</span>
        </span>

        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-slate-400 uppercase">{t('priorityScoreLabel')}:</span>
          <strong className="text-slate-900 font-bold">{priorityTotal.toFixed(1)}</strong>
          <span className="text-slate-400">/20</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRIMARY ACTION BAR (Support, Add Suggestion, View Case)    */}
      {/* ========================================================= */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        {/* Support Block & Suggestion Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Support Button */}
          <button
            type="button"
            onClick={handleSupportClick}
            disabled={isSupported || loadingSupport}
            className={`px-3.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs ${
              isSupported
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                : 'bg-slate-950 hover:bg-slate-800 text-white active:scale-98'
            }`}
          >
            {isSupported ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSupported ? t('supported') : t('supportProblem')}</span>
          </button>

          {/* Metric count next to button */}
          <span className="text-[11px] font-semibold text-slate-600">
            <strong className="text-slate-950">{supportCount}</strong> {lang === 'hi' ? 'समर्थन' : 'support'}
          </span>

          {/* Add Suggestion Button */}
          <button
            type="button"
            onClick={handleSuggestionClick}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1 transition-colors shadow-2xs"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('addSuggestion')}</span>
          </button>
        </div>

        {/* View Case Link */}
        <Link
          to={`/problem/${problem.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{t('viewProblem')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
