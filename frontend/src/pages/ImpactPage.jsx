import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { api } from '../services/api'
import ProblemStatus from '../components/common/ProblemStatus'
import { ArrowRight, CheckCircle2, Award, ShieldCheck, Users, MapPin } from 'lucide-react'

export default function ImpactPage() {
  const { lang, t, getLocalized } = useLanguage()
  const [problems, setProblems] = useState([])

  useEffect(() => {
    api.getProblems({}).then(setProblems)
  }, [])

  // Focus on adopted or completed projects that tell the story of civic impact
  const impactStories = problems.filter(p => p.impact && p.solver?.adopted_by)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t('impactHeading')}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {t('impactSubheading')}
        </p>
      </div>

      {/* Structured Civic Impact Story Sequence */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          The SolveMe Civic Pipeline:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold text-slate-700 pb-1">
          <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">1. Problem Intake</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">2. Community Validation</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">3. Solver Adoption</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200">4. Engineering Pilot</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded border border-emerald-300">
            5. Measured Civic Outcome
          </span>
        </div>
      </div>

      {/* Case Studies / Measured Outcomes */}
      <div className="space-y-4">
        {impactStories.map(p => {
          const title = getLocalized(p.title)
          const impact = p.impact

          return (
            <div key={p.id} className="panel-card p-6 space-y-4 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-slate-500">{p.id}</span>
                    <ProblemStatus status={p.status} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {title}
                  </h3>
                </div>
                <Link
                  to={`/problem/${p.id}`}
                  className="text-xs text-blue-600 font-semibold hover:underline shrink-0"
                >
                  View Full Record →
                </Link>
              </div>

              {/* Story progression */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Benefited Citizens
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{impact?.people_affected || 'N/A'}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Intervention Zone
                  </span>
                  <p className="font-bold text-slate-900 text-sm">{impact?.area_covered || p.location}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Adopted Partner
                  </span>
                  <p className="font-semibold text-slate-900 truncate">{p.solver?.adopted_by || 'Academic Lab'}</p>
                </div>

                <div className="bg-emerald-50/70 p-3 rounded border border-emerald-200">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Measured Outcome
                  </span>
                  <p className="font-medium text-emerald-950 text-xs leading-snug">{impact?.measured_outcome}</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>Verified by district validation registry</span>
                <span className="font-mono">Demo sample field metrics</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
