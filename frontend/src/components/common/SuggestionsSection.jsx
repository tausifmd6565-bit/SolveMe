import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import { Lightbulb, Plus, CheckCircle, Send, User, Award } from 'lucide-react'

export default function SuggestionsSection({ problemId, suggestions, onAddSuggestion }) {
  const { lang, t, getLocalized } = useLanguage()
  const { user } = useAuth()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [text, setText] = useState('')
  const [role, setRole] = useState('Local Resident')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState('')

  const roleOptions = [
    { value: 'Local Resident', en: 'Local Resident', hi: 'स्थानीय निवासी' },
    { value: 'Student / Researcher', en: 'Student / Researcher', hi: 'छात्र / शोधकर्ता' },
    { value: 'Civil / Field Engineer', en: 'Civil / Field Engineer', hi: 'इंजीनियर / तकनीकी विशेषज्ञ' },
    { value: 'Community Organizer', en: 'Community Organizer / NGO', hi: 'सामुदायिक कार्यकर्ता / एनजीओ' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return

    setSubmitting(true)
    try {
      onAddSuggestion(text.trim(), role)
      setText('')
      setIsFormOpen(false)
      setFeedback(lang === 'hi' ? 'आपका रचनात्मक सुझाव दर्ज कर लिया गया है।' : 'Your constructive suggestion has been recorded.')
      setTimeout(() => setFeedback(''), 4000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="suggestions-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t('suggestionsSection')}
            </h4>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {suggestions.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('suggestionsHelp')}
          </p>
        </div>

        {/* Action button */}
        {!isFormOpen && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="self-start sm:self-auto px-3.5 py-2 rounded text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('addSuggestion')}</span>
          </button>
        )}
      </div>

      {feedback && (
        <div className="p-3 rounded border border-emerald-200 bg-emerald-50 text-xs font-medium text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Inline Suggestion Composer */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 rounded-lg border border-slate-300 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {lang === 'hi' ? 'रचनात्मक इनपुट या संभावित समाधान प्रस्तावित करें' : 'Propose Constructive Input or Solution Idea'}
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
              {t('contributorRoleLabel')}
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full sm:w-64 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-medium text-slate-800 outline-none focus:border-slate-900"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {lang === 'hi' ? opt.hi : opt.en}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('suggestionPlaceholder')}
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 leading-relaxed resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="px-4 py-1.5 rounded text-xs font-semibold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>{t('submitSuggestionBtn')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Suggestions List */}
      {suggestions.length === 0 ? (
        <div className="py-6 px-4 border border-dashed border-slate-200 rounded-lg text-center text-xs text-slate-500">
          <p>{t('noSuggestionsYet')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((sug) => {
            const content = getLocalized(sug.text)
            return (
              <div
                key={sug.id}
                className="p-4 rounded-lg border border-slate-200 bg-white shadow-2xs space-y-2.5 transition-colors hover:border-slate-300"
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded bg-amber-50 border border-amber-200 text-amber-600 shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-normal flex-1">
                    "{content}"
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {sug.author}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200/60">
                      {sug.role}
                    </span>
                    {sug.verified && (
                      <span className="inline-flex items-center gap-0.5 text-blue-700 text-[10px] font-medium">
                        <Award className="w-3 h-3" />
                        {lang === 'hi' ? 'विशेषज्ञ' : 'Verified Contributor'}
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{sug.date}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
