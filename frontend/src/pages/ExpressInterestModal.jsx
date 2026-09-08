import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import { X, Check } from 'lucide-react'

export default function ExpressInterestModal({ isOpen, onClose, problem, onSuccess }) {
  const { user } = useAuth()
  const { lang, t, getLocalized } = useLanguage()

  const [organization, setOrganization] = useState(user?.organization || 'BIT Mesra — Civil & Environmental Engineering Dept')
  const [approach, setApproach] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !problem) return null

  const title = getLocalized(problem.title)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!approach.trim()) {
      setError(lang === 'hi' ? 'कृपया प्रस्तावित दृष्टिकोण लिखें' : 'Please outline your proposed approach')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await api.expressInterest(problem.id, { organization, approach }, user)
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="bg-white rounded-xl panel-border shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {t('expressModalTitle')}
            </h3>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">{problem.id} · {title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('orgLabel')}
            </label>
            <input
              type="text"
              value={organization}
              onChange={e => setOrganization(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('approachLabel')}
            </label>
            <textarea
              value={approach}
              onChange={e => setApproach(e.target.value)}
              rows={4}
              placeholder={t('approachPlaceholder')}
              className="w-full px-3 py-2 border border-slate-300 rounded text-xs outline-none focus:border-slate-900 leading-relaxed font-normal"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 border border-slate-200 text-slate-600 rounded text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{submitting ? 'Submitting...' : t('submitInterestBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
