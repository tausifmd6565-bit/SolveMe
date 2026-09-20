import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import { CATEGORIES } from '../data/mockData'
import ProblemCard from '../components/common/ProblemCard'
import { PlusCircle, Compass, FileText, CheckCircle2, FolderKanban } from 'lucide-react'

export default function Home() {
  const { lang, t, getLocalized, getCategoryName } = useLanguage()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  useEffect(() => {
    loadProblems()
  }, [selectedCategory, sortBy])

  const loadProblems = async () => {
    setLoading(true)
    try {
      const data = await api.getProblems({ category: selectedCategory, sort: sortBy })
      setProblems(data)
    } finally {
      setLoading(false)
    }
  }

  // Summary counts
  const totalReports = problems.length
  const confirmedCount = problems.filter(p => p.confirmations >= 20 || p.status === 'community_validated').length
  const activeProjectsCount = problems.filter(p => ['adopted', 'in_progress', 'prototype_pilot'].includes(p.status)).length

  return (
    <div className="space-y-6">
      {/* 1. Header & Primary Intent */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('communityProblems')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('homeSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/explore"
            className="px-3.5 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>{t('exploreProblems')}</span>
          </Link>
          <Link
            to="/report"
            className="px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('reportProblem')}</span>
          </Link>
        </div>
      </div>

      {/* 2. Compact Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('myReportsOverview')}
            </span>
            <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">{totalReports}</span>
          </div>
          <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('confirmedOverview')}
            </span>
            <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">{confirmedCount}</span>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="panel-card p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              {t('activeProjectsOverview')}
            </span>
            <span className="text-2xl font-bold text-slate-900 font-mono mt-0.5 block">{activeProjectsCount}</span>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <FolderKanban className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Problems Near You Feed with Filter & Sort */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t('problemsNearYou')}
            </h3>
            <span className="text-xs text-slate-500">
              {problems.length} {lang === 'hi' ? 'समस्याएं सूचीबद्ध' : 'challenges listed'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-700 outline-none focus:border-slate-900"
            >
              <option value="">{t('allSectors')}</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{lang === 'hi' ? c.hi : c.en}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded bg-white text-xs font-medium text-slate-700 outline-none focus:border-slate-900"
            >
              <option value="recent">{t('sortRecent')}</option>
              <option value="priority">{t('sortPriority')}</option>
              <option value="confirmations">{t('sortConfirmations')}</option>
            </select>
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            {lang === 'hi' ? 'समस्याएं लोड हो रही हैं...' : 'Loading community challenges...'}
          </div>
        ) : problems.length === 0 ? (
          <div className="panel-card p-10 text-center space-y-2">
            <p className="text-sm font-bold text-slate-800">
              {lang === 'hi' ? 'कोई समस्या नहीं मिली' : 'No problems found in this sector'}
            </p>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'अन्य श्रेणी चुनें अथवा नई समस्या दर्ज करें।' : 'Try selecting another category or report a new problem.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map(problem => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onUpdate={(updated) => {
                  setProblems(prev => prev.map(p => p.id === updated.id ? updated : p))
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
