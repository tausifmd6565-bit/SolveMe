import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import { ShieldAlert, CheckCircle2, Send, Eye } from 'lucide-react'

export default function AdminTriage() {
  const { lang, t, getLocalized, getCategoryName } = useLanguage()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('review')

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

  const needsReview = problems.filter(p => ['submitted', 'published'].includes(p.status))
  const validated = problems.filter(p => ['community_validated', 'under_review'].includes(p.status))
  const adopted = problems.filter(p => ['adopted', 'in_progress', 'prototype_pilot', 'completed'].includes(p.status))

  const handleVerify = (id) => {
    setProblems(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: 'community_validated',
          timeline: [...(p.timeline || []), { status: 'Community Validated', date: new Date().toISOString().slice(0, 10), note: 'Verified by district monitoring officer.' }]
        }
      }
      return p
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-1">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          {t('adminHeading')}
        </h2>
        <p className="text-xs text-slate-500">
          {t('adminSubheading')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('review')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            activeTab === 'review' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('tabNeedsReview')} ({needsReview.length})
        </button>
        <button
          onClick={() => setActiveTab('validated')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            activeTab === 'validated' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('tabValidated')} ({validated.length})
        </button>
        <button
          onClick={() => setActiveTab('adopted')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            activeTab === 'adopted' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {t('tabAdopted')} ({adopted.length})
        </button>
      </div>

      {/* Table */}
      <div className="panel-card overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
              <th className="p-3.5">{t('colProblem')}</th>
              <th className="p-3.5">{t('colSector')}</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">{t('colPriority')}</th>
              <th className="p-3.5">{t('colStatus')}</th>
              <th className="p-3.5 text-right">{t('colActions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(activeTab === 'review' ? needsReview : activeTab === 'validated' ? validated : adopted).map(p => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="p-3.5 max-w-sm">
                  <span className="font-mono text-[10px] text-slate-400 block">{p.id}</span>
                  <Link to={`/problem/${p.id}`} className="font-bold text-slate-900 hover:underline leading-snug block">
                    {getLocalized(p.title)}
                  </Link>
                </td>
                <td className="p-3.5 text-slate-600">{getCategoryName(p.category)}</td>
                <td className="p-3.5 text-slate-500 truncate max-w-[150px]">{p.location}</td>
                <td className="p-3.5 font-mono font-bold text-slate-900">
                  {p.priority?.total?.toFixed(1) || '12.0'} / 20
                </td>
                <td className="p-3.5"><ProblemStatus status={p.status} /></td>
                <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                  <Link
                    to={`/problem/${p.id}`}
                    className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium inline-flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3 text-slate-500" />
                    <span>Audit</span>
                  </Link>
                  {p.status !== 'community_validated' && (
                    <button
                      onClick={() => handleVerify(p.id)}
                      className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t('actionVerify')}</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
