import { Link } from 'react-router-dom'
import { MapPin, Users, Clock, ArrowRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import SeverityBadge from './SeverityBadge'

export default function ProblemCard({ problem, linkBase = '' }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days > 30) return `${Math.floor(days / 30)} months ago`
    if (days > 0) return `${days} days ago`
    const hours = Math.floor(diff / 3600000)
    if (hours > 0) return `${hours} hours ago`
    return 'Just now'
  }

  return (
    <Link
      to={`${linkBase}/problem/${problem.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-400">{problem.problem_id}</span>
            <StatusBadge status={problem.status} />
            <SeverityBadge severity={problem.severity} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 line-clamp-1">{problem.title}</h3>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
      </div>
      
      {problem.ai_category && (
        <span className="inline-block bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded mb-2">
          {problem.ai_category}
        </span>
      )}
      
      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {problem.ai_summary || problem.description}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {problem.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate max-w-[150px]">{problem.location}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {problem.confirmation_count} confirmed
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(problem.created_at)}
        </span>
      </div>
    </Link>
  )
}
