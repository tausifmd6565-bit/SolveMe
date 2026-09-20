import { useLanguage } from '../../context/LanguageContext'
import { ArrowRight, ArrowDown, Building2, CheckCircle2, CircleDashed } from 'lucide-react'

export default function SolverPathway({ solver, currentStatus }) {
  const { lang, t } = useLanguage()

  if (!solver) return null

  const stages = [
    { 
      id: 'problem', 
      title: lang === 'hi' ? 'सामुदायिक समस्या' : 'Community Problem', 
      subtitle: lang === 'hi' ? 'नागरिक सत्यापन' : 'Verified Civic Need' 
    },
    { 
      id: 'expertise', 
      title: lang === 'hi' ? 'प्रासंगिक विशेषज्ञता' : 'Relevant Expertise', 
      subtitle: solver.relevant_expertise?.[0] || (lang === 'hi' ? 'विषय विशेषज्ञता' : 'Technical Discipline') 
    },
    { 
      id: 'organization', 
      title: lang === 'hi' ? 'विश्वविद्यालय / एनजीओ' : 'University / NGO / Startup', 
      subtitle: solver.adopted_by || (lang === 'hi' ? 'भागीदार तलाश' : 'Open for Adoption') 
    },
    { 
      id: 'pilot', 
      title: lang === 'hi' ? 'पायलट प्रोटोटाइप' : 'Prototype / Pilot', 
      subtitle: lang === 'hi' ? 'मैदानी परीक्षण' : 'Applied Engineering' 
    },
    { 
      id: 'validation', 
      title: lang === 'hi' ? 'फील्ड सत्यापन' : 'Field Validation', 
      subtitle: lang === 'hi' ? 'नागरिक उपयोग' : 'User Feasibility' 
    },
    { 
      id: 'outcome', 
      title: lang === 'hi' ? 'मापा गया प्रभाव' : 'Measured Outcome', 
      subtitle: lang === 'hi' ? 'स्थाई समाधान' : 'Sustained Impact' 
    }
  ]

  // Determine which step is currently active
  const isAdopted = Boolean(solver.adopted_by)
  const isPilot = currentStatus === 'prototype_pilot' || currentStatus === 'in_progress'
  const isCompleted = currentStatus === 'completed'
  const activeStepIndex = isCompleted ? 5 : isPilot ? 3 : isAdopted ? 2 : 1

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            {t('solverPathwayFlowTitle')}
          </h4>
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {isAdopted ? (lang === 'hi' ? 'संस्थान द्वारा अंगीकृत' : 'Institution Committed') : (lang === 'hi' ? 'भागीदार हेतु खुला' : 'Open Pathway')}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          {lang === 'hi'
            ? 'SolveMe स्थानीय समस्याओं को शोध संस्थानों, स्टार्टअप्स और एनजीओ के साथ चरणबद्ध रूप से जोड़ता है।'
            : 'How SolveMe connects verified civic problems through academic R&D, pilot prototypes, and measured field outcomes.'}
        </p>
      </div>

      {/* Visual Progression Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stages.map((stage, idx) => {
          const isDone = idx < activeStepIndex
          const isCurrent = idx === activeStepIndex
          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                isCurrent
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : isDone
                  ? 'border-slate-300 bg-slate-50 text-slate-700'
                  : 'border-slate-200 bg-white/60 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span>0{idx + 1}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ) : isCurrent ? (
                  <CircleDashed className="w-3 h-3 text-blue-300 animate-spin" />
                ) : null}
              </div>
              <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-white' : 'text-slate-800'}`}>
                {stage.title}
              </p>
              <p className={`text-[10px] truncate mt-0.5 ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                {stage.subtitle}
              </p>
            </div>
          )
        })}
      </div>

      {/* Identified Core Disciplines */}
      {solver.relevant_expertise && solver.relevant_expertise.length > 0 && (
        <div className="pt-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            {lang === 'hi' ? 'पहचाने गए तकनीकी विषय एवं कौशल' : 'Potentially Relevant Engineering & Scientific Disciplines'}
          </span>
          <div className="flex flex-wrap gap-1.5">
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

      {/* Adoption Commitment Card if recorded */}
      {solver.adopted_by ? (
        <div className="p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/40 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <Building2 className="w-3.5 h-3.5 text-indigo-700" />
            <span>{lang === 'hi' ? 'अंगीकृत संस्थान:' : 'Committed Solution Partner:'} {solver.adopted_by}</span>
          </div>
          {solver.proposal && (
            <p className="text-slate-700 leading-relaxed font-normal">
              <strong className="text-slate-900">{lang === 'hi' ? 'तकनीकी दृष्टिकोण:' : 'Proposed Technical Approach:'}</strong> {solver.proposal}
            </p>
          )}
        </div>
      ) : (
        <div className="p-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-600">
          <p>
            {lang === 'hi'
              ? 'वर्तमान में यह समस्या अकादमिक एवं तकनीकी समाधानकर्ताओं द्वारा गोद लेने (Adoption) हेतु खुली है।'
              : 'This problem case is currently open for university capstones, startup incubation, or NGO intervention.'}
          </p>
        </div>
      )}
    </div>
  )
}
