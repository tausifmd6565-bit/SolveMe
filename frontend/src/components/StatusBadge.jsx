const STATUS_STYLES = {
  submitted: 'bg-gray-100 text-gray-700',
  published: 'bg-blue-100 text-blue-700',
  community_validated: 'bg-green-100 text-green-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  adopted: 'bg-purple-100 text-purple-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  prototype_pilot: 'bg-cyan-100 text-cyan-700',
  completed: 'bg-emerald-100 text-emerald-800',
  archived: 'bg-gray-200 text-gray-500',
}

const STATUS_LABELS = {
  submitted: 'Submitted',
  published: 'Published',
  community_validated: 'Community Validated',
  under_review: 'Under Review',
  adopted: 'Adopted',
  in_progress: 'In Progress',
  prototype_pilot: 'Prototype/Pilot',
  completed: 'Completed',
  archived: 'Archived',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
