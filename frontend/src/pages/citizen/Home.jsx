import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, PlusCircle, TrendingUp, Users, FileText, MapPin } from 'lucide-react'
import { problemsAPI } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'
import ProblemCard from '../../components/ProblemCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'

export default function CitizenHome() {
  const { t, lang } = useLanguage()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadProblems()
    problemsAPI.getCategories().then(res => setCategories(res.data)).catch(() => {})
  }, [category, sortBy])

  const loadProblems = async () => {
    setLoading(true)
    try {
      const params = { page_size: 50, sort_by: sortBy }
      if (category) params.category = category
      if (search) params.search = search
      const res = await problemsAPI.list(params)
      setProblems(res.data.problems)
    } catch (err) {
      console.error('Failed to load problems:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadProblems()
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-xl p-6 mb-6 text-white shadow-sm">
        <div className="max-w-2xl">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white mb-2 tracking-wide uppercase">
            {lang === 'hi' ? 'नागरिक सहभागिता मंच' : 'Citizen Crowdsourcing Platform'}
          </span>
          <h1 className="text-2xl font-bold mb-2 leading-snug">{t('heroTitle')}</h1>
          <p className="text-blue-100 text-sm mb-5 leading-relaxed">{t('heroDesc')}</p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 px-5 py-2.5 rounded-lg font-bold text-sm shadow transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            {t('reportProblem')}
          </Link>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            {t('totalProblems')}
          </div>
          <p className="text-2xl font-bold text-gray-900">{problems.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            {t('highPriority')}
          </div>
          <p className="text-2xl font-bold text-red-600">
            {problems.filter(p => p.priority_score >= 10).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            {t('communityValidated')}
          </div>
          <p className="text-2xl font-bold text-emerald-600">
            {problems.filter(p => ['community_validated', 'under_review', 'adopted', 'in_progress'].includes(p.status)).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-3.5 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            {t('categories')}
          </div>
          <p className="text-2xl font-bold text-indigo-600">{categories.length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </form>
          <div className="flex flex-wrap gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white min-w-[180px] focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="recent">{t('mostRecent')}</option>
              <option value="priority">{t('highestPriority')}</option>
              <option value="confirmations">{t('mostConfirmed')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Problem Feed */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{t('communityProblems')}</h2>
          <p className="text-xs text-gray-500">{t('communityProblemsDesc')}</p>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
          {problems.length} {lang === 'hi' ? 'समस्याएं' : 'Reports'}
        </span>
      </div>
      
      {loading ? (
        <LoadingSpinner message={lang === 'hi' ? 'समस्याएं लोड हो रही हैं...' : 'Loading community problems...'} />
      ) : problems.length === 0 ? (
        <EmptyState 
          title={lang === 'hi' ? 'कोई समस्या नहीं मिली' : 'No problems found'} 
          message={lang === 'hi' ? 'पहली समस्या दर्ज करें' : 'Be the first to report a community problem'}
        />
      ) : (
        <div className="grid gap-3">
          {problems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  )
}
