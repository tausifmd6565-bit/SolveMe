// SolveGrid API Service — Connected to Python FastAPI Backend (Port 8000)

const BACKEND_BASE = 'http://127.0.0.1:8000';

const SolveGridAPI = {
  // Helper for fetch with JSON
  async request(path, options = {}) {
    const url = `${BACKEND_BASE}${path}`;
    const token = sessionStorage.getItem('sg_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(url, { ...options, headers });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || 'Network request failed');
      }
      return await res.json();
    } catch (e) {
      console.warn(`[API Call ${path} failed, using local adapter]:`, e);
      throw e;
    }
  },

  // === Authentication ===
  async requestOtp(phone) {
    if (!phone || phone.length < 10) throw new Error('Enter a valid 10-digit mobile number.');
    return { success: true, message: `OTP sent to +91 ${phone} (Demo OTP: 246810 or any 6-digit number)` };
  },

  async verifyOtp(phone, otp, role = 'citizen') {
    if (!otp || otp.length < 6) throw new Error('Enter a 6-digit OTP code.');
    
    // Try authenticating with FastAPI backend
    try {
      const res = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, otp })
      });
      sessionStorage.setItem('sg_token', res.access_token);
      return { user: res.user, token: res.access_token };
    } catch (err) {
      // If user doesn't exist yet in backend DB, auto-register them
      try {
        const reg = await this.request('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: role === 'government' ? 'Officer ' + phone.slice(-4) : (role === 'university' ? 'Prof. Faculty ' + phone.slice(-4) : 'Citizen ' + phone.slice(-4)),
            phone,
            role,
            organization_id: role === 'university' ? 1 : null
          })
        });
        sessionStorage.setItem('sg_token', reg.access_token);
        return { user: reg.user, token: reg.access_token };
      } catch (e2) {
        // Fallback demo user
        const demoUser = {
          id: 1,
          name: role === 'citizen' ? 'Rahul Kumar' : (role === 'university' ? 'Prof. Sunil Mehta' : 'Collector Ranchi Office'),
          phone,
          role
        };
        return { user: demoUser, token: 'demo-token' };
      }
    }
  },

  // === Problems ===
  async listProblems({ category, q, sort = 'recent', mine } = {}) {
    try {
      let url = `/api/problems?page_size=100`;
      if (sort) url += `&sort_by=${sort}`;
      if (q) url += `&search=${encodeURIComponent(q)}`;
      
      const res = await this.request(url);
      let problems = res.problems || [];

      // Map backend problem model to frontend model
      let mapped = problems.map(p => this.mapBackendProblem(p));

      // Category filter (support category id like 'water' or full string)
      if (category) {
        mapped = mapped.filter(p => p.category === category || (p.ai && p.ai.category === category) || (p.category_raw && p.category_raw.toLowerCase().includes(category)));
      }

      // Filter by current user
      if (mine) {
        mapped = mapped.filter(p => p.user_phone === mine || p.submitted_by_phone === mine);
      }

      return mapped;
    } catch (e) {
      console.warn('Falling back to local cache for problems');
      return [];
    }
  },

  async getProblem(id) {
    // Check if numeric or P-prefixed
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : id;
    const res = await this.request(`/api/problems/${numericId}`);
    return this.mapBackendProblem(res);
  },

  async createProblem(form) {
    const user = JSON.parse(sessionStorage.getItem('sg_user') || '{"id": 1}');
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location_text || form.location || 'Jharkhand, India',
      severity: form.severity || 'medium',
      category: form.category || null
    };

    const res = await this.request(`/api/problems?user_id=${user.id || 1}`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return { problem_id: res.id, id: res.problem_id, ...res };
  },

  async confirmProblem(id, userPhone, note = '') {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : id;
    const user = JSON.parse(sessionStorage.getItem('sg_user') || '{"id": 2}');
    const res = await this.request(`/api/problems/${numericId}/confirm?user_id=${user.id || 2}`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
    return { success: true, message: 'Confirmation registered.', confirmations: 1 };
  },

  async expressInterest(id, org) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : id;
    const user = JSON.parse(sessionStorage.getItem('sg_user') || '{"id": 9}');
    await this.request(`/api/problems/${numericId}/adopt?user_id=${user.id || 9}`, {
      method: 'POST',
      body: JSON.stringify({ notes: `Interest from ${org.name}` })
    });
    return { success: true, message: `Interest registered for ${org.name}` };
  },

  async addUpdate(id, { note, status }) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : id;
    await this.request(`/api/problems/${numericId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({ title: status || 'Project Milestone', description: note })
    });
    // Update problem status too
    if (status) {
      await this.request(`/api/problems/${numericId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status.toLowerCase().replace(/\s+/g, '_') })
      });
    }
    return { success: true, message: 'Progress update recorded.' };
  },

  async moderateProblem(id, action) {
    const numericId = typeof id === 'string' && id.startsWith('P') ? parseInt(id.replace('P', ''), 10) : id;
    const statusMap = {
      'validate': 'community_validated',
      'review': 'under_review',
      'adopt': 'adopted'
    };
    const newStatus = statusMap[action] || 'published';
    await this.request(`/api/problems/${numericId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    return { success: true, message: `Problem status updated to ${newStatus}` };
  },

  async getAnalytics() {
    const stats = await this.request('/api/dashboard/stats');
    const priorityList = await this.request('/api/dashboard/priority-list?limit=10');
    const all = await this.listProblems();

    // Adapt to dashboard format
    const byStatus = {
      'Submitted': 0, 'Published': 0, 'Community Validated': 0, 'Under Review': 0,
      'Adopted': 0, 'In Progress': 0, 'Prototype / Pilot': 0, 'Completed': 0, 'Archived': 0
    };
    Object.entries(stats.problems_by_status || {}).forEach(([k, v]) => {
      const formatted = k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      byStatus[formatted] = (byStatus[formatted] || 0) + v;
    });

    const byCategory = {};
    CATEGORIES.forEach(c => byCategory[c.id] = 0);
    all.forEach(p => {
      if (byCategory[p.category] !== undefined) byCategory[p.category]++;
    });

    return {
      total: stats.total_problems || all.length,
      totalConfirmations: stats.total_confirmations || 0,
      adopted: stats.total_adoptions || 0,
      byStatus,
      byCategory,
      topPriority: all.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0)).slice(0, 5),
      reviewQueue: all.filter(p => p.status === 'Published' || p.status === 'Submitted' || p.status === 'Community Validated')
    };
  },

  // Map backend problem fields to fronten_2 layout expectations
  mapBackendProblem(p) {
    // Map category string back to category id
    let catId = 'water';
    const cStr = (p.ai_category || p.category || '').toLowerCase();
    if (cStr.includes('health')) catId = 'health';
    else if (cStr.includes('road') || cStr.includes('transport')) catId = 'road';
    else if (cStr.includes('agri')) catId = 'agriculture';
    else if (cStr.includes('edu')) catId = 'education';
    else if (cStr.includes('energy') || cStr.includes('elect')) catId = 'energy';
    else if (cStr.includes('waste') || cStr.includes('sanitat')) catId = 'waste';
    else if (cStr.includes('safe')) catId = 'safety';
    else if (cStr.includes('connect') || cStr.includes('digit')) catId = 'connectivity';
    else if (cStr.includes('employ') || cStr.includes('liveli')) catId = 'livelihood';

    // Format status nicely
    const rawStatus = (p.status || 'published').replace(/_/g, ' ');
    const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

    const priorityCalc = SolveGridAI.computePriority(p);

    return {
      id: p.problem_id || `P${String(p.id).padStart(3, '0')}`,
      raw_id: p.id,
      title: p.title,
      description: p.description,
      category: catId,
      category_raw: p.ai_category || p.category,
      status: formattedStatus,
      location_text: p.location || 'Jharkhand, India',
      severity: p.severity || 'medium',
      urgency: 'medium',
      affected: '200+',
      confirmations: p.confirmation_count || 0,
      priority: priorityCalc,
      priority_score: p.priority_score || SolveGridAI.priorityTotal(priorityCalc),
      evidence_type: p.evidence_urls && p.evidence_urls.length ? 'photo' : 'none',
      evidence_name: p.evidence_urls && p.evidence_urls.length ? 'Site Evidence Document' : null,
      created_at: p.created_at || new Date().toISOString(),
      ai: {
        summary: p.ai_summary || p.description?.slice(0, 160) + '...',
        tags: p.ai_tags || ['civic', 'infrastructure'],
        possible_domains: p.ai_domains || ['Civil Engineering'],
        possible_duplicate_ids: []
      },
      timeline: [
        { status: 'Submitted', at: p.created_at || new Date().toISOString(), note: 'Problem submitted by citizen' },
        ...(p.confirmation_count > 0 ? [{ status: 'Community Signal', at: p.created_at, note: `${p.confirmation_count} citizens endorsed this report` }] : []),
        ...(p.status === 'adopted' ? [{ status: 'Adopted', at: p.updated_at || new Date().toISOString(), note: 'Adopted for technical problem solving' }] : [])
      ]
    };
  }
};
