import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import { PlusCircle, FileText, ArrowUpRight } from 'lucide-react'

export default function MyProblems() {
  const { lang, t, getLocalized, getCategoryName } = useLanguage()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProblems({}).then(data => {
      // Filter to user's reports or endorsed issues
      setProblems(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('myProblems')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi'
              ? 'आपके द्वारा दर्ज की गई और समर्थित नागरिक समस्याएं'
              : 'Track status, validator vetting, and university adoptions for your issues'}
          </p>
        </div>

        <Link
          to="/report"
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t('reportProblem')}</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading your submissions...</div>
      ) : (
        <div className="space-y-2.5">
          {problems.map(p => (
            <Link
              key={p.id}
              to={`/problem/${p.id}`}
              className="panel-card p-4 block hover:border-slate-400 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-400">{p.id}</span>
                    <span className="px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium">
                      {getCategoryName(p.category)}
                    </span>
                    <ProblemStatus status={p.status} />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {getLocalized(p.title)}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location: {p.location} · {p.confirmations} citizen confirmations
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold hover:underline">
                  <span>View Progress Timeline</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
