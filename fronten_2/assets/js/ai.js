// SolveGrid AI & Priority Intelligence Engine (Member 4 Bounded Module)

const SolveGridAI = {
  // Keyword-based analysis matching the Python backend AI module
  analyzeProblem(title = '', description = '') {
    const text = (title + ' ' + description).toLowerCase();
    
    // Category detection
    let category = 'water';
    if (text.includes('health') || text.includes('hospital') || text.includes('doctor') || text.includes('medicine') || text.includes('phc') || text.includes('clinic')) {
      category = 'health';
    } else if (text.includes('road') || text.includes('pothole') || text.includes('bridge') || text.includes('traffic') || text.includes('highway')) {
      category = 'road';
    } else if (text.includes('crop') || text.includes('farmer') || text.includes('irrigation') || text.includes('farming') || text.includes('agriculture')) {
      category = 'agriculture';
    } else if (text.includes('school') || text.includes('teacher') || text.includes('student') || text.includes('education') || text.includes('classroom')) {
      category = 'education';
    } else if (text.includes('electricity') || text.includes('power') || text.includes('transformer') || text.includes('voltage') || text.includes('light')) {
      category = 'energy';
    } else if (text.includes('waste') || text.includes('garbage') || text.includes('trash') || text.includes('dump') || text.includes('pollution')) {
      category = 'waste';
    } else if (text.includes('safety') || text.includes('theft') || text.includes('police') || text.includes('crime') || text.includes('harassment')) {
      category = 'safety';
    } else if (text.includes('internet') || text.includes('network') || text.includes('mobile') || text.includes('tower') || text.includes('wifi')) {
      category = 'connectivity';
    } else if (text.includes('job') || text.includes('employment') || text.includes('unemployed') || text.includes('work') || text.includes('skill')) {
      category = 'livelihood';
    }

    // Extract tags
    const stopwords = new Set(['the','and','for','with','this','that','from','near','our','have','been','after','over','road','roadways','into','were']);
    const words = text.match(/\b[a-z]{3,}\b/g) || [];
    const tags = Array.from(new Set(words.filter(w => !stopwords.has(w)))).slice(0, 6);

    // Summary (first 2 clean sentences)
    const sentences = description.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const summary = sentences.length >= 2 ? sentences.slice(0, 2).join('. ') + '.' : (sentences[0] ? sentences[0] + '.' : title);

    const mapping = STAKEHOLDER_MAP[category] || {};

    return {
      category,
      summary: summary.slice(0, 200),
      tags,
      possible_domains: mapping.university_expertise || ['Civil Engineering', 'General Studies'],
      possible_duplicate_ids: []
    };
  },

  // Priority formula adhering strictly to SIH Work Flow Part 3:
  // Community (0-5) + Evidence (0-3) + Severity (0-5) + Urgency (0-3) + Validation (0-4) = 20 Max
  computePriority(p) {
    const confirmations = p.confirmations || p.confirmation_count || 0;
    
    // 1. Community Signal (0-5)
    let community = 0;
    if (confirmations >= 50) community = 5;
    else if (confirmations >= 25) community = 4;
    else if (confirmations >= 10) community = 3;
    else if (confirmations >= 5) community = 2;
    else if (confirmations >= 1) community = 1;

    // 2. Evidence Score (0-3)
    let evidence = 0;
    const evType = p.evidence_type || (p.evidence_urls && p.evidence_urls.length ? 'photo' : 'none');
    if (evType === 'video' || (p.evidence_urls && p.evidence_urls.length >= 2)) evidence = 3;
    else if (evType === 'photo' || (p.evidence_urls && p.evidence_urls.length >= 1)) evidence = 2;

    // 3. Severity Signal (0-5)
    const sev = (p.severity || 'medium').toLowerCase();
    const severity = sev === 'high' ? 5 : sev === 'medium' ? 3 : 1;

    // 4. Urgency Signal (0-3)
    const urg = (p.urgency || '').toLowerCase();
    const text = ((p.title || '') + ' ' + (p.description || '')).toLowerCase();
    let urgency = 1;
    if (urg === 'high' || text.includes('urgent') || text.includes('immediate') || text.includes('emergency') || text.includes('danger')) {
      urgency = 3;
    } else if (urg === 'medium' || text.includes('soon') || text.includes('risk')) {
      urgency = 2;
    }

    // 5. Validation Signal (0-4)
    let validation = 0;
    const st = (p.status || '').toLowerCase();
    if (st.includes('adopted') || st.includes('in progress')) validation = 4;
    else if (st.includes('under review') || st.includes('validated')) validation = 3;

    return { community, evidence, severity, urgency, validation };
  },

  priorityTotal(p) {
    if (typeof p === 'number') return p;
    const b = p.priority_breakdown || (p.community !== undefined ? p : this.computePriority(p));
    const total = (b.community || b.community_signal || 0) +
                  (b.evidence || b.evidence_score || 0) +
                  (b.severity || b.severity_signal || 0) +
                  (b.urgency || b.urgency_signal || 0) +
                  (b.validation || b.validation_signal || 0);
    return Math.min(20, Math.round(total));
  },

  // Professional, dignified priority classifications (NOT neon badges)
  priorityLabel(total) {
    if (total >= 14) return { text: 'Priority Tier 1 (Critical)', cls: 'text-rose-700 bg-rose-50 border border-rose-200' };
    if (total >= 10) return { text: 'Priority Tier 2 (High)', cls: 'text-amber-700 bg-amber-50 border border-amber-200' };
    if (total >= 6) return { text: 'Priority Tier 3 (Moderate)', cls: 'text-slate-700 bg-slate-100 border border-slate-200' };
    return { text: 'Priority Tier 4 (Routine)', cls: 'text-slate-600 bg-slate-50 border border-slate-200' };
  }
};
