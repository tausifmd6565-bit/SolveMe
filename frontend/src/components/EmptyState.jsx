import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data found', message = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="w-12 h-12 text-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-gray-500">{title}</h3>
      {message && <p className="text-sm text-gray-400 mt-1">{message}</p>}
    </div>
  )
}
