import { useLanguage } from '../../context/LanguageContext'

export default function SolverPathway({ solver }) {
  const { lang, t } = useLanguage()

  if (!solver) return null

  return (
    <div className="panel-card p-5 space-y-4 bg-white">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          {t('solverPathwayTitle')}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('solverPathwaySubtitle')}
        </p>
      </div>

      {/* Expertise */}
      {solver.relevant_expertise && solver.relevant_expertise.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {lang === 'hi' ? 'पहचाने गए तकनीकी कौशल' : 'Identified Core Disciplines'}
          </span>
          <div className="flex flex-wrap gap-2">
            {solver.relevant_expertise.map((exp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded border border-slate-200 bg-slate-50 text-slate-800 text-xs font-medium"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Potential Pathways */}
      {solver.potential_pathways && solver.potential_pathways.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            {t('potentialPathways')}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {solver.potential_pathways.map((path, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700 flex items-start gap-2"
              >
                <span className="text-slate-400 font-mono text-[11px] mt-0.5">0{idx + 1}</span>
                <span>{path}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Adoption / Solver Status */}
      {solver.adopted_by && (
        <div className="p-3 rounded border border-blue-200 bg-blue-50/50 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-900">
              {lang === 'hi' ? 'संस्थान द्वारा अंगीकृत:' : 'Adopted Solution Partner:'}
            </span>
            <span className="text-[11px] text-blue-700 font-semibold px-2 py-0.5 rounded bg-blue-100/60">
              {lang === 'hi' ? 'अंगीकृत' : 'Adoption Confirmed'}
            </span>
          </div>
          <p className="text-blue-950 font-medium">{solver.adopted_by}</p>
          {solver.proposal && (
            <p className="text-slate-600 text-[11px] pt-1 border-t border-blue-100">
              <strong className="text-slate-700">{lang === 'hi' ? 'प्रस्तावित दृष्टिकोण: ' : 'Technical Approach: '}</strong>
              {solver.proposal}
            </p>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 leading-normal border-t border-slate-100 pt-2">
        {t('pathwayDisclaimer')}
      </p>
    </div>
  )
}
