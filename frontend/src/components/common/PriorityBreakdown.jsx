import { useLanguage } from '../../context/LanguageContext'

export default function PriorityBreakdown({ priority }) {
  const { lang } = useLanguage()
  const p = priority || { community: 1, evidence: 0, severity: 3, urgency: 2, validation: 0, total: 6 }
  const total = p.total || (p.community + p.evidence + p.severity + p.urgency + p.validation)

  const items = [
    { label: lang === 'hi' ? 'सामुदायिक संकेत (पुष्टि)' : 'Community Signal', val: p.community || 0, max: 5 },
    { label: lang === 'hi' ? 'साक्ष्य / प्रमाण' : 'Field Evidence', val: p.evidence || 0, max: 3 },
    { label: lang === 'hi' ? 'गंभीरता स्तर' : 'Severity Signal', val: p.severity || 0, max: 5 },
    { label: lang === 'hi' ? 'तात्कालिकता' : 'Urgency Signal', val: p.urgency || 0, max: 3 },
    { label: lang === 'hi' ? 'विशेषज्ञ सत्यापन' : 'Validation Vetting', val: p.validation || 0, max: 4 },
  ]

  return (
    <div className="panel-card p-5 space-y-4">
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {lang === 'hi' ? 'नियम-आधारित प्राथमिकता अंक' : 'Rule-Based Priority Score'}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              {total >= 14 ? (lang === 'hi' ? 'उच्च प्राथमिकता' : 'Tier 1 Priority') : (lang === 'hi' ? 'मानक प्राथमिकता' : 'Tier 2 Priority')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'hi' 
              ? 'पारदर्शी गणना — सामुदायिक संकेत, साक्ष्य और जमीनी मापदंडों पर आधारित।' 
              : 'Transparent formula — derived from community validation, evidence, and hazard signals.'}
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-bold text-slate-900 font-mono">{total.toFixed(1)}</span>
          <span className="text-xs text-slate-400 font-medium"> / 20</span>
        </div>
      </div>

      {/* Horizontal Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {items.map(item => (
          <div key={item.label} className="bg-slate-50 border border-slate-200 rounded p-2.5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 truncate font-medium">{item.label}</span>
              <span className="font-mono font-bold text-slate-900">{item.val}/{item.max}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-slate-800 h-1.5 rounded-full"
                style={{ width: `${(item.val / item.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
        <span>
          {lang === 'hi' 
            ? 'ℹ️ स्कोर की गणना: समुदाय (0-5) + साक्ष्य (0-3) + गंभीरता (0-5) + तात्कालिकता (0-3) + सत्यापन (0-4)'
            : 'ℹ️ Formula: Community (0–5) + Evidence (0–3) + Severity (0–5) + Urgency (0–3) + Validation (0–4)'}
        </span>
        <span className="text-slate-400 font-medium">
          {lang === 'hi' ? 'एआई प्राथमिकता निर्धारित नहीं करता।' : 'AI does not unilaterally decide official urgency.'}
        </span>
      </div>
    </div>
  )
}
