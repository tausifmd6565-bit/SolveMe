import { useLanguage } from '../../context/LanguageContext'
import { STATUS_LIST } from '../../data/mockData'

export default function ProblemStatus({ status }) {
  const { getStatusName } = useLanguage()
  const found = STATUS_LIST.find(s => s.id === status || s.en.toLowerCase() === (status || '').toLowerCase())
  const dotColor = found?.dot || 'bg-slate-400'
  const label = getStatusName(status)

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700">
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      <span>{label}</span>
    </span>
  )
}
