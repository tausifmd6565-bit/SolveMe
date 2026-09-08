import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { problemsAPI } from '../../services/api'
import ProblemCard from '../../components/ProblemCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import EmptyState from '../../components/EmptyState'
import { FileText } from 'lucide-react'

export default function MySubmissions() {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    problemsAPI.list({ page_size: 100 }).then(res => {
      setProblems(res.data.problems.filter(p => p.submitted_by === user.id))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner message="Loading your submissions..." />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-sm text-gray-500">Track the status of problems you've reported</p>
      </div>
      {problems.length === 0 ? (
        <EmptyState title="No submissions yet" message="Report a community problem to see it here" icon={FileText} />
      ) : (
        <div className="grid gap-3">{problems.map(p => <ProblemCard key={p.id} problem={p} />)}</div>
      )}
    </div>
  )
}
