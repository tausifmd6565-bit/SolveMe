import { useLanguage } from '../../context/LanguageContext'
import { STATUS_LIST } from '../../data/mockData'

export default function ProjectTimeline({ currentStatus, timeline = [] }) {
  const { lang, getStatusName } = useLanguage()

  const normalizedCurrent = (currentStatus || 'submitted').toLowerCase().replace(/\s+/g, '_')
  const currentIndex = STATUS_LIST.findIndex(s => s.id === normalizedCurrent)

  return (
    <div className="panel-card p-5 space-y-5 bg-white">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {lang === 'hi' ? 'परियोजना जीवनचक्र (8 चरण)' : 'Project Lifecycle (8 Stages)'}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {lang === 'hi'
            ? 'समस्या प्रस्तुति से लेकर जमीनी समाधान तक की प्रगति'
            : 'Track progression from citizen intake to verified field intervention'}
        </p>
      </div>

      {/* Horizontal Lifecycle Stepper */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center min-w-[680px]">
          {STATUS_LIST.map((stage, idx) => {
            const isPassed = currentIndex >= idx
            const isCurrent = currentIndex === idx
            return (
              <div key={stage.id} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1 text-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPassed && !isCurrent ? '✓' : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-1.5 font-medium leading-tight ${
                      isCurrent
                        ? 'text-slate-900 font-bold'
                        : isPassed
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {getStatusName(stage.id)}
                  </span>
                </div>
                {idx < STATUS_LIST.length - 1 && (
                  <div
                    className={`h-0.5 w-full -mt-4 transition-colors ${
                      currentIndex > idx ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  ></div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detailed Chronological Event Log */}
      {timeline && timeline.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {lang === 'hi' ? 'प्रमाणित प्रगति विवरण' : 'Verified Event & Milestone Log'}
          </span>
          <div className="space-y-2.5">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-[11px] text-slate-400 shrink-0 mt-0.5">{item.date}</span>
                <span className="font-semibold text-slate-900 shrink-0 min-w-[140px]">{item.status}:</span>
                <span className="text-slate-600 leading-relaxed">{item.note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
