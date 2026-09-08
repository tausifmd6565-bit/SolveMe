const SEVERITY_STYLES = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

export default function SeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${SEVERITY_STYLES[severity] || 'bg-gray-100 text-gray-700'}`}>
      {severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : 'N/A'}
    </span>
  )
}
