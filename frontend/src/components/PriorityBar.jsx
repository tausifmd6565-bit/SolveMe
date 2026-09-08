export default function PriorityBar({ breakdown, score }) {
  if (!breakdown || !score) return null
  
  const maxScore = 20
  const percentage = Math.min((score / maxScore) * 100, 100)
  
  const getColor = () => {
    if (percentage >= 60) return 'bg-red-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-green-500'
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Priority Score</span>
        <span className="font-bold text-gray-900">{score} / {maxScore}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${getColor()}`} style={{ width: `${percentage}%` }}></div>
      </div>
      {breakdown && (
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
          <span>Community: {breakdown.community_signal}/5</span>
          <span>Evidence: {breakdown.evidence_score}/3</span>
          <span>Severity: {breakdown.severity_signal}/5</span>
          <span>Urgency: {breakdown.urgency_signal}/3</span>
          <span>Validation: {breakdown.validation_signal}/4</span>
        </div>
      )}
    </div>
  )
}
