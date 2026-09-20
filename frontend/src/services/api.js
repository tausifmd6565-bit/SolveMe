// SolveMe Direct FastAPI Backend Integration Service

import { INITIAL_PROBLEMS, DEFAULT_SUGGESTIONS } from '../data/mockData'

const BACKEND_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000' : '')

// Transform backend ProblemResponse to SolveMe UI format
function adaptBackendProblem(p) {
  if (!p) return null

  // Map category code
  let catId = 'water'
  const cStr = (p.ai_category || p.category || '').toLowerCase()
  if (cStr.includes('health') || cStr.includes('medic')) catId = 'health'
  else if (cStr.includes('road') || cStr.includes('transport') || cStr.includes('bridge')) catId = 'road'
  else if (cStr.includes('agri') || cStr.includes('farm') || cStr.includes('crop')) catId = 'agriculture'
  else if (cStr.includes('edu') || cStr.includes('school')) catId = 'education'
  else if (cStr.includes('energy') || cStr.includes('elect') || cStr.includes('power')) catId = 'energy'
  else if (cStr.includes('waste') || cStr.includes('sanitat') || cStr.includes('garbage')) catId = 'waste'
  else if (cStr.includes('safe') || cStr.includes('police') || cStr.includes('crime')) catId = 'safety'

  const rawStatus = (p.status || 'published').toLowerCase()

  // Breakdown from backend priority engine
  const breakdown = p.priority_breakdown || {}
  const priority = {
    community: breakdown.community_signal !== undefined ? breakdown.community_signal : (p.confirmation_count >= 25 ? 4.0 : p.confirmation_count >= 10 ? 3.0 : 1.0),
    evidence: breakdown.evidence_score !== undefined ? breakdown.evidence_score : (p.evidence_urls && p.evidence_urls.length ? 2.0 : 0.0),
    severity: breakdown.severity_signal !== undefined ? breakdown.severity_signal : (p.severity === 'high' ? 5.0 : p.severity === 'medium' ? 3.0 : 1.0),
    urgency: breakdown.urgency_signal !== undefined ? breakdown.urgency_signal : 2.0,
    validation: breakdown.validation_signal !== undefined ? breakdown.validation_signal : (rawStatus.includes('adopted') ? 4.0 : rawStatus.includes('validated') ? 3.0 : 0.0),
    total: p.priority_score || 12.0
  }

  // Known lat/lng anchors in Jharkhand for mapping
  const hash = String(p.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const lat = 23.3441 + ((hash % 10) - 5) * 0.03
  const lng = 85.3096 + (((hash * 7) % 10) - 5) * 0.03

  return {
    id: p.problem_id || `P${String(p.id).padStart(3, '0')}`,
    rawId: p.id,
    title: {
      en: p.title,
      hi: p.title
    },
    description: {
      en: p.description,
      hi: p.description
    },
    category: catId,
    location: p.location || 'Ranchi District, Jharkhand',
    lat,
    lng,
    severity: p.severity || 'medium',
    urgency: 'medium',
    status: rawStatus,
    confirmations: p.confirmation_count || 0,
    userConfirmed: false,
    evidence: p.evidence_urls && p.evidence_urls.length ? {
      type: 'photo',
      url: p.evidence_urls[0].startsWith('http') ? p.evidence_urls[0] : `${BACKEND_BASE}${p.evidence_urls[0]}`,
      caption: { en: 'Field photograph documentation', hi: 'क्षेत्रीय फोटो प्रमाण' }
    } : null,
    ai: {
      category_id: catId,
      summary: {
        en: p.ai_summary || p.description.slice(0, 160) + '...',
        hi: p.ai_summary || p.description.slice(0, 160) + '...'
      },
      tags: p.ai_tags && p.ai_tags.length ? p.ai_tags : ['community-report', 'civic-infrastructure'],
      possible_domains: p.ai_domains && p.ai_domains.length ? p.ai_domains : ['Civil Engineering', 'Public Works'],
      possible_duplicate_ids: []
    },
    priority,
    solver: {
      relevant_expertise: p.ai_domains || ['Civil Systems Engineering', 'Environmental Management'],
      potential_pathways: [
        'University Student & Faculty R&D Capstone',
        'District Municipal Authority Intervention',
        'Incubated AgriTech / CivicTech Startup'
      ],
      adopted_by: rawStatus === 'adopted' || rawStatus === 'in_progress' ? 'BIT Mesra — Civil & Environmental Dept' : null,
      project_status: rawStatus,
      proposal: rawStatus === 'adopted' ? 'Construct decentralized stormwater drainage and sediment recharge channel.' : null
    },
    timeline: [
      { status: 'Submitted', date: (p.created_at || '').slice(0, 10) || '2026-08-15', note: 'Intake verified from citizen grievance report.' },
      ...(p.confirmation_count > 0 ? [{ status: 'Community Signal', date: (p.updated_at || p.created_at || '').slice(0, 10), note: `${p.confirmation_count} citizens endorsed this civic issue.` }] : []),
      ...(rawStatus === 'adopted' ? [{ status: 'Adopted', date: (p.updated_at || '').slice(0, 10), note: 'Adopted by academic research lab for technical resolution.' }] : [])
    ],
    impact: {
      people_affected: `${100 + (p.confirmation_count || 5) * 35} citizens in catchment area`,
      area_covered: p.location || 'Local community ward',
      intervention_status: rawStatus === 'adopted' ? 'Field design finalized' : 'Open for solver adoption',
      measured_outcome: rawStatus === 'adopted' ? 'Estimated 80% reduction in local disruption upon project completion' : 'Pending adoption'
    }
  }
}

export const api = {
  // 1. GET /api/problems (with search & filters)
  async getProblems(filters = {}) {
    try {
      let query = `${BACKEND_BASE}/api/problems?page_size=100`
      if (filters.sort) query += `&sort_by=${encodeURIComponent(filters.sort)}`
      if (filters.search) query += `&search=${encodeURIComponent(filters.search)}`

      const res = await fetch(query)
      if (res.ok) {
        const data = await res.json()
        if (data.problems && data.problems.length > 0) {
          let list = data.problems.map(p => adaptBackendProblem(p))

          // Filter by category if requested
          if (filters.category) {
            list = list.filter(p => p.category === filters.category)
          }
          return list
        }
      }
    } catch (err) {
      console.warn('Backend unavailable, using initial dataset:', err)
    }

    // Graceful fallback
    let list = [...INITIAL_PROBLEMS]
    if (filters.category) list = list.filter(p => p.category === filters.category)
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(p => (p.title?.en || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q))
    }
    return list
  },

  // 2. GET /api/problems/{id}
  async getProblemById(id) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : parseInt(id, 10)

    try {
      if (!isNaN(numericId)) {
        const res = await fetch(`${BACKEND_BASE}/api/problems/${numericId}`)
        if (res.ok) {
          const data = await res.json()
          return adaptBackendProblem(data)
        }
      }
    } catch (err) {
      console.warn('Backend problem fetch error, falling back:', err)
    }

    // Fallback to local
    const found = INITIAL_PROBLEMS.find(p => p.id === id || String(p.id) === String(id))
    if (!found) throw new Error('Problem not found')
    return found
  },

  // 3. POST /api/problems (creates in backend SQLite DB)
  async createProblem(data, user) {
    const userId = user?.id || 1
    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      severity: data.severity || 'medium'
    }

    try {
      const res = await fetch(`${BACKEND_BASE}/api/problems?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const created = await res.json()
        return adaptBackendProblem(created)
      }
    } catch (err) {
      console.warn('Backend create failed, fallback to local:', err)
    }

    // Fallback if backend offline
    const newId = `P${100 + INITIAL_PROBLEMS.length + 1}`
    const mock = {
      id: newId,
      title: { en: data.title, hi: data.title },
      description: { en: data.description, hi: data.description },
      category: data.category || 'water',
      location: data.location || 'Ranchi, Jharkhand',
      lat: data.lat || 23.3441,
      lng: data.lng || 85.3096,
      severity: data.severity || 'medium',
      urgency: data.urgency || 'medium',
      status: 'submitted',
      confirmations: 1,
      userConfirmed: true,
      evidence: data.evidence,
      ai: {
        category_id: data.category || 'water',
        summary: { en: data.description.slice(0, 160) + '...', hi: data.description.slice(0, 160) + '...' },
        tags: ['civic-issue'],
        possible_domains: ['Civil Engineering'],
        possible_duplicate_ids: []
      },
      priority: { community: 1, evidence: 0, severity: 3, urgency: 2, validation: 0, total: 6 },
      solver: { relevant_expertise: ['Civil Engineering'], potential_pathways: ['Municipal Works'], adopted_by: null },
      timeline: [{ status: 'Submitted', date: new Date().toISOString().slice(0, 10), note: 'Submitted via citizen intake wizard.' }],
      impact: { people_affected: 'Pending survey', area_covered: data.location, intervention_status: 'Submitted', measured_outcome: 'Pending adoption' }
    }
    INITIAL_PROBLEMS.unshift(mock)
    return mock
  },

  // 4. POST /api/problems/{id}/confirm (persists in backend DB & recalculates priority)
  async confirmProblem(id, user) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : parseInt(id, 10)
    const userId = user?.id || 2

    try {
      if (!isNaN(numericId)) {
        const res = await fetch(`${BACKEND_BASE}/api/problems/${numericId}/confirm?user_id=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: 'Confirmed endorsement from citizen' })
        })
        if (res.ok) {
          // Fetch updated problem with recalculated priority score from DB
          return await this.getProblemById(numericId)
        }
      }
    } catch (err) {
      console.warn('Backend confirmation call failed, updating local state:', err)
    }

    const found = INITIAL_PROBLEMS.find(p => p.id === id || String(p.id) === String(id) || p.rawId === numericId)
    if (found) {
      found.confirmations = (found.confirmations || 0) + 1
      found.userConfirmed = true
      found.priority = {
        ...found.priority,
        community: Math.min(5.0, (found.priority?.community || 0) + 0.5),
        total: Math.min(20.0, (found.priority?.total || 0) + 0.5)
      }
      return found
    }
    return { id, confirmations: 1, userConfirmed: true }
  },

  // 5. POST /api/problems/{id}/adopt (express interest)
  async expressInterest(id, proposal, user) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : parseInt(id, 10)
    const userId = user?.id || 9

    try {
      if (!isNaN(numericId)) {
        await fetch(`${BACKEND_BASE}/api/problems/${numericId}/adopt?user_id=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: proposal.approach })
        })
        return await this.getProblemById(numericId)
      }
    } catch (err) {
      console.warn('Backend adopt call failed:', err)
    }

    const found = INITIAL_PROBLEMS.find(p => p.id === id)
    if (found) {
      found.status = 'under_review'
      found.solver = {
        ...found.solver,
        adopted_by: proposal.organization || 'Academic Research Partner',
        proposal: proposal.approach
      }
      return found
    }
    throw new Error('Problem not found')
  },

  // 6. POST /api/problems/{id}/milestones
  async addMilestone(id, milestone) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : parseInt(id, 10)

    try {
      if (!isNaN(numericId)) {
        await fetch(`${BACKEND_BASE}/api/problems/${numericId}/milestones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: milestone.status, description: milestone.note })
        })
        return await this.getProblemById(numericId)
      }
    } catch (err) {
      console.warn('Backend milestone call failed:', err)
    }

    const found = INITIAL_PROBLEMS.find(p => p.id === id)
    if (found) {
      found.status = milestone.status
      found.timeline.push({
        status: milestone.status,
        date: new Date().toISOString().slice(0, 10),
        note: milestone.note
      })
      return found
    }
    throw new Error('Problem not found')
  },

  // 7. GET /api/dashboard/stats
  async getDashboardStats() {
    try {
      const res = await fetch(`${BACKEND_BASE}/api/dashboard/stats`)
      if (res.ok) {
        return await res.json()
      }
    } catch (e) {}
    return null
  },

  // 8. GET /api/problems/{id}/suggestions
  getSuggestions(problemId) {
    try {
      const key = `solveme_suggestions_${problemId}`
      const local = localStorage.getItem(key)
      if (local) return JSON.parse(local)

      const pKey = typeof problemId === 'string' && problemId.startsWith('P') ? problemId : `P${problemId}`
      const defaults = DEFAULT_SUGGESTIONS[pKey] || [
        {
          id: `sug-${problemId}-def1`,
          text: {
            en: 'Water testing and initial topography review should be conducted before final engineering plans are drawn.',
            hi: 'अंतिम इंजीनियरिंग योजना तैयार करने से पहले जल परीक्षण और प्रारंभिक स्थलाकृति समीक्षा की जानी चाहिए।'
          },
          author: 'Er. R. K. Soren',
          role: 'Technical Reviewer',
          date: '3 days ago',
          verified: true
        }
      ]
      localStorage.setItem(key, JSON.stringify(defaults))
      return defaults
    } catch (e) {
      return []
    }
  },

  // 9. POST /api/problems/{id}/suggestions
  addSuggestion(problemId, text, user, role = 'Local Resident') {
    const list = this.getSuggestions(problemId)
    const newSug = {
      id: `sug-${Date.now()}`,
      text: { en: text, hi: text },
      author: user?.name || 'Concerned Citizen',
      role: role || (user?.role === 'solver' ? 'Academic / Technical Partner' : user?.role === 'admin' ? 'Administrative Reviewer' : 'Local Resident'),
      date: 'Just now',
      verified: user?.role === 'solver' || user?.role === 'admin'
    }
    const updated = [newSug, ...list]
    try {
      localStorage.setItem(`solveme_suggestions_${problemId}`, JSON.stringify(updated))
    } catch (e) {}
    return updated
  }
}
